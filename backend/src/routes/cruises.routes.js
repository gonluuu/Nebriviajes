const express = require("express");
const router = express.Router();

const {
  searchCruises,
  createCruise,
} = require("../controllers/cruises.controller");

router.get("/", searchCruises);
router.post("/", createCruise);

module.exports = router;
