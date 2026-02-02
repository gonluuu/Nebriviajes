const Cruise = require("../models/cruises.model");

// GET /api/cruises
const searchCruises = async (req, res, next) => {
  try {
    const { origin, destination, maxPrice, minDuration } = req.query;

    const query = {};

    if (origin) query.origin = origin;
    if (destination) query.destination = destination;

    if (maxPrice) {
      query.priceFrom = { $lte: Number(maxPrice) };
    }

    if (minDuration) {
      query.durationDays = { $gte: Number(minDuration) };
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
  createCruise,
};
