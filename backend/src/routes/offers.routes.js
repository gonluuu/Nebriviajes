const express = require("express");
const router = express.Router();
const { searchOffers, getOfferById, createOffer } = require("../controllers/offers.controller");
router.get("/", searchOffers);
router.get("/:id", getOfferById);
router.post("/", createOffer);
module.exports = router;
