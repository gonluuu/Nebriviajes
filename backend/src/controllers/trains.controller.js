const Train = require("../models/trains.model");

// GET /api/trains
const searchTrains = async (req, res, next) => {
  try {
    const { origin, destination, date, maxPrice, direct } = req.query;

    const query = {};

    if (origin) query.origin = origin;
    if (destination) query.destination = destination;
    if (date) query.date = date;

    if (maxPrice) {
      query.price = { $lte: Number(maxPrice) };
    }

    if (direct !== undefined) {
      query.directo = direct === "true";
    }

    query.available = true;

    const trains = await Train.find(query).sort({ price: 1 });

    res.json({
      count: trains.length,
      results: trains,
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/trains
const createTrain = async (req, res, next) => {
  try {
    const train = await Train.create(req.body);
    res.status(201).json(train);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  searchTrains,
  createTrain,
};
