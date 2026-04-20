const Vehicle = require("../models/vehicles.model");

const escapeRegex = (s = "") => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// GET /api/vehicles/:id
const getVehicleById = async (req, res, next) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) return res.status(404).json({ message: "Vehículo no encontrado" });
    res.json(vehicle);
  } catch (error) {
    next(error);
  }
};

// GET /api/vehicles
const searchVehicles = async (req, res, next) => {
  try {
    const { city, date, maxPrice, minPrice, type, dateFrom, dateTo } = req.query;

    const query = {};

    if (city) query.city = { $regex: `^${escapeRegex(String(city).trim())}$`, $options: "i" };

    if (date) query.date = String(date).trim();
    if (dateFrom || dateTo) {
      query.date = {
        ...(dateFrom ? { $gte: String(dateFrom).trim() } : {}),
        ...(dateTo ? { $lte: String(dateTo).trim() } : {}),
      };
    }

    if (minPrice || maxPrice) {
      query.price = {
        ...(minPrice ? { $gte: Number(minPrice) } : {}),
        ...(maxPrice ? { $lte: Number(maxPrice) } : {}),
      };
    }

    // Advanced Filters
    const { transmission, fuel, doors, unlimitedMileage, providers, type: reqType } = req.query;

    if (reqType) query.type = { $regex: `^${escapeRegex(String(reqType).trim())}$`, $options: "i" };

    if (transmission) {
      const transArray = transmission.split(",");
      if (transArray.length > 0) {
        query.transmission = { $in: transArray.map(t => new RegExp(`^${escapeRegex(t.trim())}$`, "i")) };
      }
    }

    if (fuel) {
      const fuelArray = fuel.split(",");
      if (fuelArray.length > 0) {
        query.fuel = { $in: fuelArray.map(f => new RegExp(`^${escapeRegex(f.trim())}$`, "i")) };
      }
    }

    if (doors) {
      const doorsArray = doors.split(",").map(Number);
      if (doorsArray.length > 0) {
        query.doors = { $in: doorsArray };
      }
    }

    if (unlimitedMileage === "true") {
      query.unlimitedMileage = true;
    }

    if (providers) {
      const provArray = providers.split(",");
      if (provArray.length > 0) {
        query.provider = { $in: provArray.map(p => new RegExp(`^${escapeRegex(p.trim())}$`, "i")) };
      }
    }

    query.available = true;

    const vehicles = await Vehicle.find(query).sort({ price: 1 });

    res.json({
      count: vehicles.length,
      results: vehicles,
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/vehicles
const createVehicle = async (req, res, next) => {
  try {
    const vehicle = await Vehicle.create(req.body);
    res.status(201).json(vehicle);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  searchVehicles,
  getVehicleById,
  createVehicle,
};
