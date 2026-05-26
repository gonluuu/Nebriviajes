const express = require("express");
const router = express.Router();

const {
  searchHotels,
  getHotelById,
  createHotel,
  updateHotel,
  deleteHotel,
} = require("../controllers/hotels.controller");
const { requireAuth, requireAdmin } = require("../middleware/auth.middleware");

router.get("/", searchHotels);
router.get("/:id", getHotelById);
router.post("/", requireAuth, requireAdmin, createHotel);
router.put("/:id", requireAuth, requireAdmin, updateHotel);
router.delete("/:id", requireAuth, requireAdmin, deleteHotel);

module.exports = router;
