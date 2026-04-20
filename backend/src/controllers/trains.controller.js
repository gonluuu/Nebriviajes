const Train = require("../models/trains.model");

const escapeRegex = (s = "") => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// GET /api/trains/:id
const getTrainById = async (req, res, next) => {
  try {
    const train = await Train.findById(req.params.id);
    if (!train) return res.status(404).json({ message: "Tren no encontrado" });
    res.json(train);
  } catch (error) {
    next(error);
  }
};

// GET /api/trains
const searchTrains = async (req, res, next) => {
  try {
    const { origin, destination, date, maxPrice, minPrice, direct, dateFrom, dateTo } = req.query;

    const query = {};

    if (origin) query.origin = { $regex: `^${escapeRegex(String(origin).trim())}$`, $options: "i" };
    if (destination) query.destination = { $regex: `^${escapeRegex(String(destination).trim())}$`, $options: "i" };

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

    if (direct !== undefined && direct !== "") {
      // En el modelo el campo se llama "direct"
      query.direct = direct === "true";
    }

    // Advanced Filters
    const { trainClass, company, maxDuration } = req.query;

    if (trainClass) {
      const classesArray = trainClass.split(",");
      if (classesArray.length > 0) {
        query.trainClass = { $in: classesArray.map(c => new RegExp(`^${escapeRegex(c.trim())}$`, "i")) };
      }
    }

    if (company) {
      const companiesArray = company.split(",");
      if (companiesArray.length > 0) {
        query.company = { $in: companiesArray.map(c => new RegExp(`^${escapeRegex(c.trim())}$`, "i")) };
      }
    }

    if (maxDuration) {
      query.durationMinutes = { $lte: Number(maxDuration) };
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
  getTrainById,
  createTrain,
};
