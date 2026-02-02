const express = require("express");
const router = express.Router();

const {
  searchVehicles,
  createVehicle,
} = require("../controllers/vehicles.controller");

router.get("/", searchVehicles);
router.post("/", createVehicle);

module.exports = router;
