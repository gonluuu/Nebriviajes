const express = require("express");
const router = express.Router();

const {
  searchOffers,
  createOffer,
} = require("../controllers/offers.controller");

router.get("/", searchOffers);
router.post("/", createOffer);

module.exports = router;
