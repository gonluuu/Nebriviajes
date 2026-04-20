const express = require("express");
const router = express.Router();

const {
  searchHotels,
  getHotelById,
  createHotel,
} = require("../controllers/hotels.controller");

router.get("/", searchHotels);
router.get("/:id", getHotelById);
router.post("/", createHotel);

module.exports = router;
