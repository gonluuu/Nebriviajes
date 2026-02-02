const Offer = require("../models/offers.model");

// GET /api/offers
const searchOffers = async (req, res, next) => {
  try {
    const { type, destination, maxPrice } = req.query;

    const query = {};

    if (type) query.type = type;
    if (destination) query.destination = destination;

    if (maxPrice) {
      query.price = { $lte: Number(maxPrice) };
    }

    query.available = true;

    const offers = await Offer.find(query).sort({ price: 1 });

    res.json({
      count: offers.length,
      results: offers,
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/offers
const createOffer = async (req, res, next) => {
  try {
    const offer = await Offer.create(req.body);
    res.status(201).json(offer);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  searchOffers,
  createOffer,
};
