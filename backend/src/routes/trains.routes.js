const express = require("express");
const router = express.Router();

const {
  searchTrains,
  getTrainById,
  createTrain,
} = require("../controllers/trains.controller");

router.get("/", searchTrains);
router.get("/:id", getTrainById);
router.post("/", createTrain);

module.exports = router;
