const express = require("express");
const router = express.Router();

const {
  searchTrains,
  createTrain,
} = require("../controllers/trains.controller");

router.get("/", searchTrains);
router.post("/", createTrain);

module.exports = router;
