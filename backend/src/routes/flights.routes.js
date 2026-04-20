const express = require("express");
const router = express.Router(); // se crea un router independiente

const {
  searchFlights,
  getFlightById,
  createFlight
} = require("../controllers/flights.controller"); // Importas las funciones del controller

router.get("/", searchFlights); // GET /api/flights → searchFlights

router.get("/:id", getFlightById); // GET /api/flights/:id → getFlightById

router.post("/", createFlight); // POST /api/flights → createFlight

module.exports = router;

