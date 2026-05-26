const stripeFactory = require("stripe");
const { supabase } = require("../db/supabase");
const { CONFIG } = require("./catalog.controller");
const { rowToClient } = require("../utils/supabaseMapper");

const demoSessions = global.__NEBRIVIAJES_DEMO_SESSIONS__ || new Map();
global.__NEBRIVIAJES_DEMO_SESSIONS__ = demoSessions;

function hasRealStripeKey() {
  const key = String(process.env.STRIPE_SECRET_KEY || "").trim();
  return key.startsWith("sk_test_") || key.startsWith("sk_live_");
}

function getStripe() {
  if (!hasRealStripeKey()) return null;
  return stripeFactory(String(process.env.STRIPE_SECRET_KEY).trim());
}

function tableByType(type) {
  return CONFIG[`${type}s`]?.table || ({ flight: "flights", hotel: "hotels", train: "trains", vehicle: "vehicles", cruise: "cruises", package: "packages", offer: "offers" })[type];
}

function normalizePrice(value) {
  const number = Number(value);
  if (!Number.isFinite(number) || number <= 0) return 10;
  return number;
}

function normalizeItems(items = []) {
  return items.filter((item) => item?.type && item?.itemId).map((item) => ({
    type: String(item.type),
    itemId: String(item.itemId),
    title: String(item.title || "Reserva NebriViajes"),
    subtitle: String(item.subtitle || ""),
    price: normalizePrice(item.price),
    imageUrl: String(item.imageUrl || ""),
  }));
}

function buildCartMetadata(items) {
  const json = JSON.stringify(items);
  const metadata = { cart_chunks: "0" };
  const chunks = json.match(/.{1,450}/g) || [];
  metadata.cart_chunks = String(chunks.length);
  chunks.forEach((chunk, index) => { metadata[`cart_${index}`] = chunk; });
  return metadata;
}

function readCartMetadata(metadata = {}) {
  const count = Number(metadata.cart_chunks || 0);
  let json = "";
  for (let index = 0; index < count; index += 1) json += metadata[`cart_${index}`] || "";
  if (!json) return [];
  try { return normalizeItems(JSON.parse(json)); } catch (_) { return []; }
}

async function createReservationsFromItems(items, user) {
  const created = [];
  const skipped = [];

  for (const item of items) {
    const table = tableByType(item.type);
    if (!table) { skipped.push({ item, reason: "Tipo no válido" }); continue; }

    const { data: product, error } = await supabase.from(table).select("*").eq("id", item.itemId).single();
    if (error || !product) { skipped.push({ item, reason: "Producto no disponible" }); continue; }

    const snapshot = {
      ...rowToClient(product),
      userEmail: user?.email || "",
      userName: user?.name || "",
    };

    const { data: reserva, error: reservaError } = await supabase.from("reservations").insert({
      user_id: user?.id || null,
      item_type: item.type,
      original_id: product.id,
      snapshot,
      status: "completed",
      total_price: item.price,
    }).select("*").single();

    if (reservaError) { skipped.push({ item, reason: reservaError.message }); continue; }
    created.push(rowToClient(reserva));
  }

  return { created, skipped };
}

async function createCheckoutSession(req, res) {
  try {
    const items = normalizeItems(req.body?.items);
    if (!items.length) return res.status(400).json({ message: "El carrito está vacío" });

    const origin = req.body?.origin || process.env.FRONTEND_URL || req.headers.origin || "http://localhost:5173";
    const stripe = getStripe();

    // Modo desarrollo: permite probar reservas sin configurar Stripe todavía.
    if (!stripe) {
      const demoId = `demo_${Date.now()}_${Math.random().toString(36).slice(2)}`;
      demoSessions.set(demoId, { items, userId: req.user?.id || null, createdAt: Date.now() });
      return res.json({
        url: `${origin}/pago/correcto?session_id=${demoId}&demo=1`,
        demo: true,
        message: "Stripe no está configurado. Se usará pago de prueba local.",
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: items.map((item) => ({
        price_data: {
          currency: "eur",
          product_data: {
            name: item.title,
            description: item.subtitle || undefined,
            images: /^https?:\/\//i.test(item.imageUrl) ? [item.imageUrl] : undefined,
          },
          unit_amount: Math.max(50, Math.round(item.price * 100)),
        },
        quantity: 1,
      })),
      mode: "payment",
      metadata: buildCartMetadata(items),
      success_url: `${origin}/pago/correcto?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/pago/cancelado`,
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error?.message || "Error creando sesión de pago" });
  }
}

async function confirmCheckoutSession(req, res, next) {
  try {
    const { sessionId } = req.body || {};
    if (!sessionId) return res.status(400).json({ message: "Falta sessionId" });

    let items = [];

    if (String(sessionId).startsWith("demo_")) {
      const demo = demoSessions.get(sessionId);
      if (!demo) return res.status(404).json({ message: "La sesión de pago de prueba no existe o caducó" });
      items = normalizeItems(demo.items);
      demoSessions.delete(sessionId);
    } else {
      const stripe = getStripe();
      if (!stripe) return res.status(500).json({ message: "Falta STRIPE_SECRET_KEY real para confirmar este pago" });
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      if (session.payment_status !== "paid") return res.status(402).json({ message: "El pago no está confirmado" });
      items = readCartMetadata(session.metadata);
    }

    if (!items.length) return res.status(400).json({ message: "La sesión de pago no tiene productos" });

    const { created, skipped } = await createReservationsFromItems(items, req.user);
    res.json({ message: "Pago confirmado", count: created.length, results: created, skipped });
  } catch (error) { next(error); }
}

module.exports = { createCheckoutSession, confirmCheckoutSession };
