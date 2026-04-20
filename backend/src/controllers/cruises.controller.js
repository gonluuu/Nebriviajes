const Cruise = require("../models/cruises.model");

const escapeRegex = (s = "") => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// GET /api/cruises/:id
const getCruiseById = async (req, res, next) => {
  try {
    const cruise = await Cruise.findById(req.params.id);
    if (!cruise) return res.status(404).json({ message: "Crucero no encontrado" });
    res.json(cruise);
  } catch (error) {
    next(error);
  }
};

// GET /api/cruises
const searchCruises = async (req, res, next) => {
  try {
    const { origin, destination, maxPrice, minPrice, minDuration, departure, country } = req.query;

    const query = {};

    if (origin) query.origin = { $regex: `^${escapeRegex(String(origin).trim())}$`, $options: "i" };
    if (destination) query.destination = { $regex: `^${escapeRegex(String(destination).trim())}$`, $options: "i" };

    // Filtrar por fecha de salida (en tu modelo está en array `departures` como string)
    if (departure) query.departures = { $in: [String(departure).trim()] };

    // Filtrar por país incluido (array `countries`)
    if (country) query.countries = { $in: [String(country).trim()] };

    if (minPrice || maxPrice) {
      query.priceFrom = {
        ...(minPrice ? { $gte: Number(minPrice) } : {}),
        ...(maxPrice ? { $lte: Number(maxPrice) } : {}),
      };
    }

    if (minDuration) {
      query.durationDays = { ...(query.durationDays || {}), $gte: Number(minDuration) };
    }

    // Advanced Filters
    const { cruiseType, services, maxDuration, company } = req.query;

    if (cruiseType) {
      const typesArray = cruiseType.split(",");
      if (typesArray.length > 0) {
        query.type = { $in: typesArray.map(t => new RegExp(`^${escapeRegex(t.trim())}$`, "i")) };
      }
    }

    if (services) {
      const servicesArray = services.split(",");
      if (servicesArray.length > 0) {
        query.services = { $all: servicesArray.map(s => new RegExp(`^${escapeRegex(s.trim())}$`, "i")) };
      }
    }

    if (maxDuration) {
      query.durationDays = { ...(query.durationDays || {}), $lte: Number(maxDuration) };
    }

    if (company) {
      const companiesArray = company.split(",");
      if (companiesArray.length > 0) {
        query.name = { $in: companiesArray.map(c => new RegExp(escapeRegex(c.trim()), "i")) };
      }
    }

    query.available = true;

    const cruises = await Cruise.find(query).sort({ priceFrom: 1 });

    res.json({
      count: cruises.length,
      results: cruises,
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/cruises
const createCruise = async (req, res, next) => {
  try {
    const cruise = await Cruise.create(req.body);
    res.status(201).json(cruise);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  searchCruises,
  getCruiseById,
  createCruise,
};
