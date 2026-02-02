const Package = require("../models/packages.model");

// GET /api/packages
const searchPackages = async (req, res, next) => {
  try {
    const { destination, maxPrice, minDuration } = req.query;

    const query = {};

    if (destination) query.destination = destination;

    if (maxPrice) {
      query.price = { $lte: Number(maxPrice) };
    }

    if (minDuration) {
      query.durationDays = { $gte: Number(minDuration) };
    }

    query.available = true;

    const packages = await Package.find(query).sort({ price: 1 });

    res.json({
      count: packages.length,
      results: packages,
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/packages
const createPackage = async (req, res, next) => {
  try {
    const packageCreated = await Package.create(req.body);
    res.status(201).json(packageCreated);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  searchPackages,
  createPackage,
};
