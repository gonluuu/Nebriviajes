const Hotel = require("../models/hotels.model");

const escapeRegex = (s = "") => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// GET /api/hotels/:id
const getHotelById = async (req, res, next) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    if (!hotel) return res.status(404).json({ message: "Hotel no encontrado" });
    res.json(hotel);
  } catch (error) {
    next(error);
  }
};

// GET /api/hotels
const searchHotels = async (req, res, next) => {
  try {
    const { city, maxPrice, minPrice, date, dateFrom, dateTo } = req.query;

    const query = {};

    if (city) query.city = { $regex: `^${escapeRegex(String(city).trim())}$`, $options: "i" };

    if (date) query.date = String(date).trim();

    // Rango de fechas (solo fiable si tu `date` está en formato ISO YYYY-MM-DD)
    if (dateFrom || dateTo) {
      query.date = {
        ...(dateFrom ? { $gte: String(dateFrom).trim() } : {}),
        ...(dateTo ? { $lte: String(dateTo).trim() } : {}),
      };
    }

    // Advanced Filters
    const { stars, minRating, type, amenities, maxDistance, freeCancellation } = req.query;

    if (stars) {
      const starsArray = stars.split(",").map(Number);
      if (starsArray.length > 0) {
        query.stars = { $in: starsArray };
      }
    }

    if (minRating) {
      query.rating = { $gte: Number(minRating) };
    }

    if (type) {
      const typesArray = type.split(",");
      if (typesArray.length > 0) {
        query.type = { $in: typesArray.map(t => new RegExp(`^${escapeRegex(t.trim())}$`, "i")) };
      }
    }

    if (amenities) {
      const amenitiesArray = amenities.split(",");
      if (amenitiesArray.length > 0) {
        query.amenities = { $all: amenitiesArray.map(a => new RegExp(`^${escapeRegex(a.trim())}$`, "i")) };
      }
    }

    if (maxDistance) {
      query.distanceToCenter = { $lte: Number(maxDistance) };
    }

    if (freeCancellation === "true") {
      query.freeCancellation = true;
    }

    if (minPrice || maxPrice) {
      query.price = {
        ...(minPrice ? { $gte: Number(minPrice) } : {}),
        ...(maxPrice ? { $lte: Number(maxPrice) } : {}),
      };
    }

    // En el schema el campo es `available`
    query.available = true;

    // OJO: no ordenamos por precio. Queremos que salgan "desordenados" en el listado.
    // (Si el frontend quiere un orden concreto, ya lo puede aplicar allí.)
    const hotels = await Hotel.find(query);

    res.json({
      count: hotels.length,
      results: hotels,
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/hotels
const createHotel = async (req, res, next) => {
  try {
    const hotel = await Hotel.create(req.body);
    res.status(201).json(hotel);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  searchHotels,
  getHotelById,
  createHotel,
};
