const express = require("express")
const router = express.Router()
const {
  getHoteles,
  getHotelById,
  createHotel
} = require("../controllers/hoteles.controller")

router.get("/", getHoteles)
router.get("/:id", getHotelById)
router.post("/", createHotel)

module.exports = router
