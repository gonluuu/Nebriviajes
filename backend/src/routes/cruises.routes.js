const express = require("express");
const router = express.Router();

const {
  searchCruises,
  getCruiseById,
  createCruise,
} = require("../controllers/cruises.controller");

router.get("/", searchCruises);
router.get("/:id", getCruiseById);
router.post("/", createCruise);

module.exports = router;
