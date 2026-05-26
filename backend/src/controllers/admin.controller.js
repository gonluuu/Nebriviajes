const { supabase } = require("../db/supabase");
const { rowToClient } = require("../utils/supabaseMapper");

async function count(table, filter) {
  let q = supabase.from(table).select("*", { count: "exact", head: true });
  if (filter) q = filter(q);
  const { count: c, error } = await q;
  if (error) throw error;
  return c || 0;
}

async function getAdminStats(req, res, next) {
  try {
    const [usersCount, adminCount, reservasCount, hotelsCount, reservas] = await Promise.all([
      count("profiles"),
      count("profiles", (q) => q.eq("role", "admin")),
      count("reservations"),
      count("hotels"),
      supabase.from("reservations").select("item_type"),
    ]);
    if (reservas.error) throw reservas.error;
    const grouped = {};
    for (const r of reservas.data || []) grouped[r.item_type] = (grouped[r.item_type] || 0) + 1;
    res.json({ usersCount, adminCount, reservasCount, hotelsCount, reservasByType: Object.entries(grouped).map(([type, total]) => ({ type, total })) });
  } catch (err) { next(err); }
}

async function listUsers(req, res, next) {
  try {
    const { data, error } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });
    if (error) throw error;
    const results = (data || []).map((p) => ({ ...rowToClient(p), _id: p.id, isAdmin: p.role === "admin" }));
    res.json({ count: results.length, results });
  } catch (err) { next(err); }
}

async function deleteUser(req, res, next) {
  try {
    const { id } = req.params;
    if (String(req.user.id) === String(id)) return res.status(400).json({ message: "No puedes eliminar tu propio usuario administrador" });
    await supabase.from("reservations").delete().eq("user_id", id);
    await supabase.from("favorites").delete().eq("user_id", id);
    await supabase.from("profiles").delete().eq("id", id);
    const { error } = await supabase.auth.admin.deleteUser(id);
    if (error) throw error;
    res.json({ message: "Usuario eliminado" });
  } catch (err) { next(err); }
}

module.exports = { getAdminStats, listUsers, deleteUser };
