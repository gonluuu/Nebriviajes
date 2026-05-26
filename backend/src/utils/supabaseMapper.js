function toCamel(key) {
  return String(key).replace(/_([a-z])/g, (_, c) => c.toUpperCase());
}
function toSnake(key) {
  return String(key).replace(/[A-Z]/g, (c) => `_${c.toLowerCase()}`);
}
function rowToClient(row = {}) {
  if (!row || typeof row !== "object") return row;
  const out = {};
  for (const [key, value] of Object.entries(row)) out[toCamel(key)] = value;
  if (row.id) out._id = row.id;
  if (row.image_url && !out.imageUrl) out.imageUrl = row.image_url;
  if (row.price_from != null && out.priceFrom == null) out.priceFrom = row.price_from;
  if (row.price_from != null && out.price == null) out.price = row.price_from;
  if (row.price_current != null && out.price == null) out.price = row.price_current;
  if (row.price_original != null && out.priceOriginal == null) out.priceOriginal = row.price_original;
  if (row.price_per_person != null && out.pricePerPerson == null) out.pricePerPerson = row.price_per_person;
  if (row.price_per_person != null && out.price == null) out.price = row.price_per_person;
  if (row.offer_type && !out.type) out.type = row.offer_type;
  if (row.item_type && !out.type) out.type = row.item_type;
  if (row.original_id && !out.originalId) out.originalId = row.original_id;
  if (row.user_id && !out.userId) out.userId = row.user_id;
  if (row.duration_minutes != null && !out.duration) out.duration = `${row.duration_minutes} min`;
  if (row.created_at && !out.createdAt) out.createdAt = row.created_at;
  if (row.updated_at && !out.updatedAt) out.updatedAt = row.updated_at;
  return out;
}
function cleanUndefined(obj) {
  return Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined && v !== ""));
}
function clientToRow(payload = {}) {
  const out = {};
  for (const [key, value] of Object.entries(payload || {})) {
    if (["_id", "id", "createdAt", "updatedAt", "created_at", "updated_at"].includes(key)) continue;
    out[toSnake(key)] = value;
  }
  if (payload.imageUrl !== undefined) out.image_url = payload.imageUrl;
  if (payload.priceFrom !== undefined) out.price_from = payload.priceFrom;
  if (payload.pricePerPerson !== undefined) out.price_per_person = payload.pricePerPerson;
  if (payload.startDate !== undefined) out.start_date = payload.startDate;
  if (payload.durationDays !== undefined) out.duration_days = payload.durationDays;
  if (payload.originalId !== undefined) out.original_id = payload.originalId;
  if (payload.userId !== undefined) out.user_id = payload.userId;
  return cleanUndefined(out);
}
function normalizeEmail(email = "") {
  return String(email).trim().toLowerCase();
}
function getAdminEmailsFromEnv() {
  return String(process.env.ADMIN_EMAILS || "").split(",").map(normalizeEmail).filter(Boolean);
}
module.exports = { rowToClient, clientToRow, normalizeEmail, getAdminEmailsFromEnv };
