/**
 * NebriViajes — Script de migración MongoDB → Supabase (PostgreSQL)
 *
 * Requisitos:
 *   npm install mongodb @supabase/supabase-js
 *
 * Variables de entorno (.env):
 *   MONGO_URI=mongodb://localhost:27017/nebriviajes
 *   SUPABASE_URL=https://<tu-proyecto>.supabase.co
 *   SUPABASE_SERVICE_KEY=<service_role_key>   ← usa service_role, no anon
 */

require("dotenv").config();
const { MongoClient } = require("mongodb");
const { createClient } = require("@supabase/supabase-js");

// ── Clientes ─────────────────────────────────────────────────
const mongo = new MongoClient(process.env.MONGO_URI);
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// ── Helpers ───────────────────────────────────────────────────

/** Convierte _id de Mongo a string limpio */
function mongoId(doc) {
  const id = doc._id;
  if (!id) return null;
  if (typeof id === "string") return id;
  if (id.$oid) return id.$oid;
  return String(id);
}

/** Inserta en lotes y registra errores sin detener la migración */
async function upsertBatch(table, rows) {
  if (!rows.length) return;
  const { error } = await supabase
    .from(table)
    .upsert(rows, { onConflict: "mongo_id" });
  if (error) {
    console.error(`  ✗ Error en tabla "${table}":`, error.message);
  } else {
    console.log(`  ✓ ${rows.length} registros insertados en "${table}"`);
  }
}

// ── Transformadores ───────────────────────────────────────────

function transformFlight(doc) {
  return {
    mongo_id:       mongoId(doc),
    origin:         doc.origin,
    destination:    doc.destination,
    departure_date: doc.departureDate || null,
    date_return:    doc.dateReturn || null,
    duration:       doc.duration || null,
    airline:        doc.airline || null,
    price:          doc.price || null,
    image_url:      doc.imageUrl || null,
    available:      doc.available ?? true,
  };
}

function transformHotel(doc) {
  return {
    mongo_id:  mongoId(doc),
    name:      doc.name,
    city:      doc.city,
    price:     doc.price || null,
    date:      doc.date || null,
    image_url: doc.imageUrl || null,
    available: doc.available ?? true,
  };
}

function transformTrain(doc) {
  // price puede ser { amount, currency } o un número
  const priceAmount =
    typeof doc.price === "object" ? doc.price?.amount : doc.price;
  const currency =
    typeof doc.price === "object" ? doc.price?.currency : "EUR";

  return {
    mongo_id:          mongoId(doc),
    origin:            doc.origin,
    destination:       doc.destination,
    date:              doc.date || null,
    departure_time:    doc.departureTime || null,
    arrival_time:      doc.arrivalTime || null,
    time_slot:         doc.timeSlot || null,
    price:             priceAmount || null,
    currency:          currency || "EUR",
    duration_minutes:  doc.durationMinutes || null,
    train_type:        doc.trainType || null,
    rail_company:      doc.railCompany || null,
    classes:           Array.isArray(doc.class) ? doc.class : [],
    transfers:         doc.transfers ?? 0,
    direct:            doc.direct ?? true,
    luggage_included:  doc.luggageIncluded ?? true,
    image_url:         doc.imageUrl || null,
    available:         doc.available ?? true,
  };
}

function transformVehicle(doc) {
  return {
    mongo_id:  mongoId(doc),
    city:      doc.city,
    date:      doc.date || null,
    price:     doc.price || null,
    type:      doc.type || null,
    image_url: doc.imageUrl || null,
    available: doc.available ?? true,
  };
}

function transformCruise(doc) {
  // price puede ser { from, currency }
  const priceFrom =
    typeof doc.price === "object" ? doc.price?.from : doc.price;
  const currency =
    typeof doc.price === "object" ? doc.price?.currency : "EUR";

  // Normalizar cabinTypes a minúsculas para consistencia
  const cabinTypes = Array.isArray(doc.cabinTypes)
    ? doc.cabinTypes.map((c) => c.toLowerCase())
    : [];

  return {
    mongo_id:            mongoId(doc),
    name:                doc.name,
    type:                doc.type || null,
    duration_days:       doc.durationDays || null,
    origin:              doc.origin || null,
    destination:         doc.destination || null,
    region:              doc.region || null,
    price_from:          priceFrom || null,
    currency:            currency || "EUR",
    cruise_line:         doc.cruiseLine || null,
    passenger_capacity:  doc.passengerCapacity || null,
    cabin_types:         cabinTypes,
    meal_plan:           doc.mealPlan || null,
    ports_count:         doc.portsCount || null,
    ports:               Array.isArray(doc.ports) ? doc.ports : [],
    free_cancellation:   doc.freeCancellation ?? false,
    image_url:           doc.imageUrl || null,
    available:           doc.available ?? true,
  };
}

function transformPackage(doc) {
  // pricePerPerson puede ser { amount, currency }
  const priceAmount =
    typeof doc.pricePerPerson === "object"
      ? doc.pricePerPerson?.amount
      : doc.pricePerPerson;
  const currency =
    typeof doc.pricePerPerson === "object"
      ? doc.pricePerPerson?.currency
      : "EUR";

  return {
    mongo_id:             mongoId(doc),
    title:                doc.title,
    destination:          doc.destination || null,
    destination_country:  doc.destinationCountry || null,
    departure_airports:   Array.isArray(doc.departureAirports)
                            ? doc.departureAirports : [],
    start_date:           doc.startDate || null,
    duration_days:        doc.durationDays || null,
    price_per_person:     priceAmount || null,
    currency:             currency || "EUR",
    package_type:         doc.packageType || null,
    includes:             Array.isArray(doc.includes) ? doc.includes : [],
    meal_plan:            doc.mealPlan || null,
    hotel_category:       doc.hotelCategory || null,
    rating:               doc.rating || null,
    reviews_count:        doc.reviewsCount || null,
    free_cancellation:    doc.freeCancellation ?? true,
    image_url:            doc.imageUrl || null,
    available:            doc.available ?? true,
  };
}

function transformOffer(doc) {
  // NOTA: estructura inconsistente en los documentos originales.
  // Algunos tienen discountPercentage en raíz, otros dentro de price.
  // travelDates.durationDays en algunos, durationDays en raíz en otros.

  const priceObj = typeof doc.price === "object" ? doc.price : {};
  const travelDates = typeof doc.travelDates === "object" ? doc.travelDates : {};

  const priceCurrent    = priceObj.current ?? null;
  const priceOriginal   = priceObj.original ?? null;
  const currency        = priceObj.currency ?? "EUR";
  const discountPct     =
    doc.discountPercentage ??
    priceObj.discountPercentage ??
    null;

  const travelStart = travelDates.start ?? null;
  const travelEnd   = travelDates.end   ?? null;
  const durationDays =
    doc.durationDays ??
    travelDates.durationDays ??
    null;

  return {
    mongo_id:              mongoId(doc),
    title:                 doc.title,
    description:           doc.description || null,
    offer_type:            doc.offerType || null,
    origin:                doc.origin || null,
    destination:           doc.destination || null,
    destination_country:   doc.destinationCountry || null,
    price_current:         priceCurrent,
    price_original:        priceOriginal,
    currency:              currency,
    discount_percentage:   discountPct,
    travel_start:          travelStart,
    travel_end:            travelEnd,
    duration_days:         durationDays,
    is_flash_offer:        doc.isFlashOffer ?? false,
    flash_ends_at:         doc.flashEndsAt  ?? null,
    image_url:             doc.imageUrl     || null,
    available:             doc.available    ?? true,
    created_at:            doc.createdAt    || new Date().toISOString(),
  };
}

// ── Migración principal ───────────────────────────────────────

async function migrate() {
  console.log("🚀 Iniciando migración NebriViajes: MongoDB → Supabase\n");

  await mongo.connect();
  const db = mongo.db(); // usa la BD del URI

  const tasks = [
    { collection: "flights",  table: "flights",  transform: transformFlight  },
    { collection: "hotels",   table: "hotels",   transform: transformHotel   },
    { collection: "trains",   table: "trains",   transform: transformTrain   },
    { collection: "vehicles", table: "vehicles", transform: transformVehicle },
    { collection: "cruises",  table: "cruises",  transform: transformCruise  },
    { collection: "packages", table: "packages", transform: transformPackage },
    { collection: "offers",   table: "offers",   transform: transformOffer   },
  ];

  for (const { collection, table, transform } of tasks) {
    console.log(`📦 Migrando colección: ${collection}`);
    try {
      const docs = await db.collection(collection).find({}).toArray();
      console.log(`  → ${docs.length} documentos encontrados`);
      const rows = docs.map(transform);
      await upsertBatch(table, rows);
    } catch (err) {
      console.error(`  ✗ Error al leer colección "${collection}":`, err.message);
    }
  }

  await mongo.close();
  console.log("\n✅ Migración completada.");
}

migrate().catch((err) => {
  console.error("❌ Error fatal:", err);
  process.exit(1);
});