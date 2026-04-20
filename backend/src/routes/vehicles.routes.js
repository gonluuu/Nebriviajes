const express = require("express");
const router = express.Router();

const {
  searchVehicles,
  getVehicleById,
  createVehicle,
} = require("../controllers/vehicles.controller");

router.get("/", searchVehicles);
router.get("/:id", getVehicleById);
router.post("/", createVehicle);

module.exports = router;
