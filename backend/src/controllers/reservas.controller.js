const { supabase } = require("../db/supabase");
const { CONFIG } = require("./catalog.controller");
const { rowToClient } = require("../utils/supabaseMapper");

function isAdmin(user) { return user?.isAdmin || user?.role === "admin"; }
function tableByType(type) { return CONFIG[`${type}s`]?.table || ({ flight: "flights", hotel: "hotels", train: "trains", vehicle: "vehicles", cruise: "cruises", package: "packages", offer: "offers" })[type]; }
function reservaToClient(row = {}) {
  const out = rowToClient(row);
  out._id = row.id;
  out.type = row.item_type;
  out.originalId = row.original_id;
  out.userId = row.user_id;
  out.userEmail = row.snapshot?.userEmail || row.snapshot?.user_email || out.userEmail;
  out.userName = row.snapshot?.userName || row.snapshot?.user_name || out.userName;
  return out;
}

async function listReservas(req, res, next) {
  try {
    let query = supabase.from("reservations").select("*");
    if (req.query.type) query = query.eq("item_type", req.query.type);
    if (!isAdmin(req.user)) query = query.eq("user_id", req.user.id);
    const { data, error } = await query.order("created_at", { ascending: false });
    if (error) throw error;
    const results = (data || []).map(reservaToClient);
    res.json({ count: results.length, results });
  } catch (err) { next(err); }
}

async function createReserva(req, res, next) {
  try {
    const { type, itemId } = req.body || {};
    if (!type || !itemId) return res.status(400).json({ message: "type e itemId son obligatorios" });
    const table = tableByType(type);
    if (!table) return res.status(400).json({ message: "type no válido" });

    const { data: item, error: itemError } = await supabase.from(table).select("*").eq("id", itemId).single();
    if (itemError || !item) return res.status(404).json({ message: "No existe ese elemento" });

    const normalized = rowToClient(item);
    const snapshot = { ...normalized, userEmail: req.user.email, userName: req.user.name };
    const { data: reserva, error } = await supabase.from("reservations").insert({
      user_id: req.user.id,
      item_type: type,
      original_id: item.id,
      snapshot,
      status: "completed",
      total_price: normalized.price || normalized.priceFrom || normalized.pricePerPerson || null,
    }).select("*").single();
    if (error) throw error;

    // No eliminamos el producto del catálogo: una reserva no debe hacer desaparecer hoteles/vuelos/ofertas.
    res.status(201).json(reservaToClient(reserva));
  } catch (err) { next(err); }
}

async function restoreReserva(req, res, next) {
  try {
    const { id } = req.params;
    const { data: reserva, error } = await supabase.from("reservations").select("*").eq("id", id).single();
    if (error || !reserva) return res.status(404).json({ message: "Reserva no encontrada" });

    if (!isAdmin(req.user) && reserva.user_id !== req.user.id) {
      return res.status(403).json({ message: "No puedes anular una reserva que no es tuya" });
    }

    const table = tableByType(reserva.item_type);
    if (!table) return res.status(400).json({ message: "type no válido" });

    const snapshot = { ...(reserva.snapshot || {}) };
    const dataToRestore = { ...snapshot, id: reserva.original_id, available: true };
    delete dataToRestore._id;
    delete dataToRestore.createdAt;
    delete dataToRestore.updatedAt;
    delete dataToRestore.userEmail;
    delete dataToRestore.userName;

    // Convertimos claves camelCase del snapshot a snake_case antes de reinsertar.
    const { clientToRow } = require("../utils/supabaseMapper");
    const row = clientToRow(dataToRestore);
    row.id = reserva.original_id;
    row.available = true;

    const { data: restored, error: restoreError } = await supabase.from(table).upsert(row, { onConflict: "id" }).select("*").single();
    if (restoreError) throw restoreError;

    await supabase.from("reservations").delete().eq("id", id);
    res.json({ message: "Restaurado", restored: rowToClient(restored) });
  } catch (err) { next(err); }
}

module.exports = { listReservas, createReserva, restoreReserva };
