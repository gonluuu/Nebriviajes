const { supabase } = require("../db/supabase");
const { rowToClient, clientToRow } = require("../utils/supabaseMapper");

function firstNonEmpty(...values) {
  return values.find((value) => value !== undefined && value !== null && String(value).trim() !== "");
}

function sameDayRange(value) {
  const date = firstNonEmpty(value);
  if (!date) return null;
  return [`${date}T00:00:00`, `${date}T23:59:59`];
}

const CONFIG = {
  flights: {
    table: "flights",
    search: async (q, query) => {
      if (q.origin) query = query.ilike("origin", `%${String(q.origin).trim()}%`);
      if (q.destination) query = query.ilike("destination", `%${String(q.destination).trim()}%`);
      if (q.minPrice) query = query.gte("price", Number(q.minPrice));
      if (q.maxPrice) query = query.lte("price", Number(q.maxPrice));
      const departureDate = firstNonEmpty(q.departureDate, q.startDate, q.date);
      const returnDate = firstNonEmpty(q.returnDate, q.endDate);
      if (departureDate) query = query.gte("departure_date", `${departureDate}T00:00:00`).lt("departure_date", `${departureDate}T23:59:59`);
      if (returnDate) query = query.gte("date_return", `${returnDate}T00:00:00`).lt("date_return", `${returnDate}T23:59:59`);
      return query.order("price", { ascending: true });
    },
  },
  hotels: {
    table: "hotels",
    search: async (q, query) => {
      if (q.city) query = query.ilike("city", `%${String(q.city).trim()}%`);
      if (q.minPrice) query = query.gte("price", Number(q.minPrice));
      if (q.maxPrice) query = query.lte("price", Number(q.maxPrice));
      const hotelDate = firstNonEmpty(q.date, q.checkIn, q.startDate);
      if (hotelDate) query = query.eq("date", hotelDate);
      return query.order("price", { ascending: true });
    },
  },
  trains: {
    table: "trains",
    search: async (q, query) => {
      if (q.origin) query = query.ilike("origin", `%${String(q.origin).trim()}%`);
      if (q.destination) query = query.ilike("destination", `%${String(q.destination).trim()}%`);
      const trainDate = firstNonEmpty(q.date, q.startDate);
      if (trainDate) query = query.eq("date", trainDate);
      if (q.minPrice) query = query.gte("price", Number(q.minPrice));
      if (q.maxPrice) query = query.lte("price", Number(q.maxPrice));
      return query.order("price", { ascending: true });
    },
  },
  vehicles: {
    table: "vehicles",
    search: async (q, query) => {
      if (q.city) query = query.ilike("city", `%${String(q.city).trim()}%`);
      const vehicleDate = firstNonEmpty(q.date, q.startDate);
      if (vehicleDate) query = query.eq("date", vehicleDate);
      if (q.type) query = query.ilike("type", `%${String(q.type).trim()}%`);
      if (q.minPrice) query = query.gte("price", Number(q.minPrice));
      if (q.maxPrice) query = query.lte("price", Number(q.maxPrice));
      return query.order("price", { ascending: true });
    },
  },
  cruises: {
    table: "cruises",
    search: async (q, query) => {
      if (q.origin) query = query.ilike("origin", `%${String(q.origin).trim()}%`);
      if (q.destination) query = query.ilike("destination", `%${String(q.destination).trim()}%`);
      if (q.minPrice) query = query.gte("price_from", Number(q.minPrice));
      if (q.maxPrice) query = query.lte("price_from", Number(q.maxPrice));
      if (q.minDuration) query = query.gte("duration_days", Number(q.minDuration));
      if (q.country) query = query.ilike("destination_country", `%${String(q.country).trim()}%`);
      return query.order("price_from", { ascending: true });
    },
  },
  packages: {
    table: "packages",
    search: async (q, query) => {
      if (q.destination) query = query.ilike("destination", `%${String(q.destination).trim()}%`);
      if (q.country) query = query.ilike("destination_country", `%${String(q.country).trim()}%`);
      if (q.startDate) query = query.gte("start_date", q.startDate);
      if (q.endDate) query = query.lte("start_date", q.endDate);
      if (q.minPrice) query = query.gte("price_per_person", Number(q.minPrice));
      if (q.maxPrice) query = query.lte("price_per_person", Number(q.maxPrice));
      return query.order("price_per_person", { ascending: true });
    },
  },
  offers: {
    table: "offers",
    search: async (q, query) => {
      if (q.destination) query = query.ilike("destination", `%${String(q.destination).trim()}%`);
      if (q.type) query = query.ilike("offer_type", `%${String(q.type).trim()}%`);
      if (q.minPrice) query = query.gte("price_current", Number(q.minPrice));
      if (q.maxPrice) query = query.lte("price_current", Number(q.maxPrice));
      return query.order("price_current", { ascending: true });
    },
  },
};

function getConfig(key) {
  const cfg = CONFIG[key];
  if (!cfg) throw Object.assign(new Error("Recurso no válido"), { status: 400 });
  return cfg;
}

function makeSearch(resource) {
  return async (req, res, next) => {
    try {
      const cfg = getConfig(resource);
      let query = supabase.from(cfg.table).select("*").eq("available", true);
      query = await cfg.search(req.query || {}, query);
      const { data, error } = await query;
      if (error) throw error;
      const results = (data || []).map(rowToClient);
      res.json({ count: results.length, results });
    } catch (err) { next(err); }
  };
}

function makeGetById(resource) {
  return async (req, res, next) => {
    try {
      const cfg = getConfig(resource);
      const { data, error } = await supabase.from(cfg.table).select("*").eq("id", req.params.id).single();
      if (error || !data) return res.status(404).json({ message: "Elemento no encontrado" });
      res.json(rowToClient(data));
    } catch (err) { next(err); }
  };
}

function makeCreate(resource) {
  return async (req, res, next) => {
    try {
      const cfg = getConfig(resource);
      const { data, error } = await supabase.from(cfg.table).insert(clientToRow(req.body)).select("*").single();
      if (error) throw error;
      res.status(201).json(rowToClient(data));
    } catch (err) { next(err); }
  };
}

function makeUpdate(resource) {
  return async (req, res, next) => {
    try {
      const cfg = getConfig(resource);
      const { data, error } = await supabase.from(cfg.table).update(clientToRow(req.body)).eq("id", req.params.id).select("*").single();
      if (error || !data) return res.status(404).json({ message: "Elemento no encontrado" });
      res.json(rowToClient(data));
    } catch (err) { next(err); }
  };
}

function makeDelete(resource) {
  return async (req, res, next) => {
    try {
      const cfg = getConfig(resource);
      const { error } = await supabase.from(cfg.table).delete().eq("id", req.params.id);
      if (error) throw error;
      res.json({ message: "Elemento eliminado" });
    } catch (err) { next(err); }
  };
}

module.exports = { CONFIG, makeSearch, makeGetById, makeCreate, makeUpdate, makeDelete };
