// Lógica de negocio

const Flight = require("../models/flights.model");

const searchFlights = async (req, res, next) => {
  // GET /api/flights
  try {
    const { origen, destino, fechaSalida, maxPrecio } = req.query; // /api/flights?origin=BCN&destination=DPS
    const query = {};
    if (origen) query.origen = origen.toUpperCase();
    if (destino) query.destino = destino.toUpperCase();
    if (fechaSalida) {
    }
    if (maxPrecio) {
      query.precio = { $lte: Number(maxPrecio) }; // $lte = less than or equal
    }

    const flights = await Flight.find(query).sort({ precio: 1 });

    res.json({
      count: flights.length,
      results: flights,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  searchFlights,
};
