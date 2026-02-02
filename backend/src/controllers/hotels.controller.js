const Hotel = require("../models/hotels.model");

// GET /api/hotels
const searchHotels = async (req, res, next) => {
  try {
    const { city, maxPrice, date } = req.query;

    const query = {};

    if (city) {
      query.city = city;
    }

    if (date) {
      query.date = date;
    }

    if (maxPrice) {
      query.price = { $lte: Number(maxPrice) };
    }

    query.disponible = true;

    const hotels = await Hotel.find(query).sort({ price: 1 });

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
  createHotel,
};
