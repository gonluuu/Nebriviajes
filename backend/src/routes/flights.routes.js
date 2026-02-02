const express = require("express");
const router = express.Router(); // se crea un router independiente

const {
  searchFlights,
  createFlight
} = require("../controllers/flights.controller"); // Importas las funciones del controller

router.get("/", searchFlights); // GET /api/flights → searchFlights

router.post("/", createFlight); // POST /api/flights → createFlight

module.exports = router;

