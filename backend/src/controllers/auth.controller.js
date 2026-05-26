const { supabase } = require("../db/supabase");
const { normalizeEmail, getAdminEmailsFromEnv, rowToClient } = require("../utils/supabaseMapper");

function profileToUser(profile, authUser = {}) {
  const email = normalizeEmail(profile?.email || authUser?.email || "");
  const role = profile?.role || (getAdminEmailsFromEnv().includes(email) ? "admin" : "user");
  return {
    _id: authUser?.id || profile?.id,
    id: authUser?.id || profile?.id,
    name: profile?.name || authUser?.user_metadata?.name || email,
    email,
    role,
    isAdmin: role === "admin",
    createdAt: profile?.created_at || authUser?.created_at,
  };
}

async function upsertProfile(authUser, name) {
  const email = normalizeEmail(authUser.email);
  const role = getAdminEmailsFromEnv().includes(email) ? "admin" : "user";
  const payload = { id: authUser.id, email, name: name || authUser.user_metadata?.name || email, role };
  const { data, error } = await supabase.from("profiles").upsert(payload, { onConflict: "id" }).select("*").single();
  if (error) throw error;
  return data;
}

async function getProfile(userId, authUser) {
  const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single();
  if (!error && data) return data;
  return upsertProfile(authUser, authUser?.user_metadata?.name);
}

async function register(req, res, next) {
  try {
    const { name, email, password } = req.body || {};
    const normalizedEmail = normalizeEmail(email);
    if (!name || !normalizedEmail || !password) return res.status(400).json({ message: "Faltan datos" });

    const { data: created, error: createError } = await supabase.auth.admin.createUser({
      email: normalizedEmail,
      password,
      email_confirm: true,
      user_metadata: { name },
    });
    if (createError) return res.status(400).json({ message: createError.message || "No se pudo registrar" });

    const profile = await upsertProfile(created.user, name);
    const { data: sessionData, error: signInError } = await supabase.auth.signInWithPassword({
      email: normalizedEmail,
      password,
    });
    if (signInError) return res.status(201).json({ user: profileToUser(profile, created.user), token: null });

    res.status(201).json({ user: profileToUser(profile, created.user), token: sessionData.session?.access_token });
  } catch (err) { next(err); }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body || {};
    const normalizedEmail = normalizeEmail(email);
    if (!normalizedEmail || !password) return res.status(400).json({ message: "Faltan datos" });

    const { data, error } = await supabase.auth.signInWithPassword({ email: normalizedEmail, password });
    if (error || !data?.user) return res.status(401).json({ message: "Credenciales incorrectas" });

    const profile = await getProfile(data.user.id, data.user);
    res.json({ user: profileToUser(profile, data.user), token: data.session?.access_token });
  } catch (err) { next(err); }
}

async function me(req, res, next) {
  try {
    res.json({ user: profileToUser(req.profile, req.authUser) });
  } catch (err) { next(err); }
}

module.exports = { register, login, me, profileToUser };
