const { supabase } = require("../db/supabase");
const { normalizeEmail, getAdminEmailsFromEnv } = require("../utils/supabaseMapper");

async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;
    if (!token) return res.status(401).json({ message: "Necesitas iniciar sesión" });

    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data?.user) return res.status(401).json({ message: "Sesión no válida o caducada" });

    let { data: profile } = await supabase.from("profiles").select("*").eq("id", data.user.id).single();
    if (!profile) {
      const email = normalizeEmail(data.user.email);
      const role = getAdminEmailsFromEnv().includes(email) ? "admin" : "user";
      const upsert = await supabase.from("profiles").upsert({
        id: data.user.id,
        email,
        name: data.user.user_metadata?.name || email,
        role,
      }, { onConflict: "id" }).select("*").single();
      profile = upsert.data;
    }

    req.authUser = data.user;
    req.profile = profile;
    req.user = {
      _id: data.user.id,
      id: data.user.id,
      email: profile?.email || data.user.email,
      name: profile?.name || data.user.email,
      role: profile?.role || "user",
      isAdmin: profile?.role === "admin",
    };
    next();
  } catch (err) {
    return res.status(401).json({ message: "Sesión no válida o caducada" });
  }
}

function requireAdmin(req, res, next) {
  if (req.user?.role !== "admin" && !req.user?.isAdmin) {
    return res.status(403).json({ message: "No tienes permisos de administrador" });
  }
  next();
}

module.exports = { requireAuth, requireAdmin };
