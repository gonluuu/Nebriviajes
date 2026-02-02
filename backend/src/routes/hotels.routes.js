const express = require("express");
const router = express.Router();

const {
  searchHotels,
  createHotel,
} = require("../controllers/hotels.controller");

router.get("/", searchHotels);
router.post("/", createHotel);

module.exports = router;
