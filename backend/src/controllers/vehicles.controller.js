const Vehicle = require("../models/vehicles.model");

// GET /api/vehicles
const searchVehicles = async (req, res, next) => {
  try {
    const { city, date, maxPrice, type } = req.query;

    const query = {};

    if (city) query.city = city;
    if (date) query.date = date;

    if (maxPrice) {
      query.price = { $lte: Number(maxPrice) };
    }

    if (type) {
      query.type = type;
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
  createVehicle,
};
