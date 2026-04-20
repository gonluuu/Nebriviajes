const Flight = require("../models/flights.model");

const escapeRegex = (s = "") => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

function dayRange(dateStr) {
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return null;
  const start = new Date(d);
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(end.getDate() + 1);
  return { start, end };
}

// GET /api/flights/:id
const getFlightById = async (req, res, next) => {
  try {
    const flight = await Flight.findById(req.params.id);
    if (!flight)
      return res.status(404).json({ message: "Vuelo no encontrado" });
    res.json(flight);
  } catch (err) {
    next(err);
  }
};

const searchFlights = async (req, res, next) => {
  try {
    const {
      origin,
      destination,
      maxPrice,
      minPrice,
      departureDate,
      returnDate,
    } = req.query;
    const query = {};

    if (origin)
      query.origin = {
        $regex: `^${escapeRegex(String(origin).trim())}$`,
        $options: "i",
      };
    if (destination)
      query.destination = {
        $regex: `^${escapeRegex(String(destination).trim())}$`,
        $options: "i",
      };

    if (departureDate) {
      const r = dayRange(departureDate);
      if (r) query.departureDate = { $gte: r.start, $lt: r.end };
    }

    if (returnDate) {
      const r = dayRange(returnDate);
      if (r) query.dateReturn = { $gte: r.start, $lt: r.end };
    }

    // Advanced Filters
    const { stops, airlines, maxDuration, departureTime, flightClass, includesLuggage } = req.query;

    if (stops) {
      // stops expected as comma separated numbers: "0", "1", "2"
      const stopsArray = stops.split(",").map(Number);
      if (stopsArray.length > 0) {
        query.stops = { $in: stopsArray };
      }
    }

    if (airlines) {
      // airlines expected as comma separated strings: "Iberia,Ryanair"
      const airlinesArray = airlines.split(",");
      if (airlinesArray.length > 0) {
        query.airline = { $in: airlinesArray.map(a => new RegExp(`^${escapeRegex(a.trim())}$`, "i")) };
      }
    }

    if (maxDuration) {
      // Assuming maxDuration is passed in minutes for filtering
      query.durationMinutes = { $lte: Number(maxDuration) };
    }

    if (departureTime) {
      // "morning", "afternoon", "evening" based on hour
      // For simplicity, assuming frontend will filter or we need complex date aggregation here.
      // Standard way: Add $expr to extract hour and filter.
      let hours = [];
      if (departureTime.includes("morning")) hours.push({ $and: [{ $gte: [{ $hour: "$departureDate" }, 6] }, { $lt: [{ $hour: "$departureDate" }, 12] }] });
      if (departureTime.includes("afternoon")) hours.push({ $and: [{ $gte: [{ $hour: "$departureDate" }, 12] }, { $lt: [{ $hour: "$departureDate" }, 18] }] });
      if (departureTime.includes("evening")) hours.push({ $or: [{ $gte: [{ $hour: "$departureDate" }, 18] }, { $lt: [{ $hour: "$departureDate" }, 6] }] });

      if (hours.length > 0) {
        query.$expr = { $or: hours };
      }
    }

    if (flightClass) {
      const classesArray = flightClass.split(",");
      if (classesArray.length > 0) {
        query.flightClass = { $in: classesArray.map(c => new RegExp(`^${escapeRegex(c.trim())}$`, "i")) };
      }
    }

    if (includesLuggage === "true") {
      query.includesLuggage = true;
    }

    if (minPrice || maxPrice) {
      query.price = {
        ...(minPrice ? { $gte: Number(minPrice) } : {}),
        ...(maxPrice ? { $lte: Number(maxPrice) } : {}),
      };
    }

    query.available = true;

    const flights = await Flight.find(query).sort({ price: 1 });

    res.json({
      count: flights.length,
      results: flights,
    });
  } catch (err) {
    next(err);
  }
};

const createFlight = async (req, res, next) => {
  try {
    const flight = await Flight.create(req.body);
    res.status(201).json(flight);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  searchFlights,
  getFlightById,
  createFlight,
};
