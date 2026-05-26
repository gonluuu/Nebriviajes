const express = require("express");
const router = express.Router();

const { requireAuth } = require("../middleware/auth.middleware");
const {
  createCheckoutSession,
  confirmCheckoutSession,
} = require("../controllers/payment.controller");

router.post("/checkout", requireAuth, createCheckoutSession);
router.post("/confirm", requireAuth, confirmCheckoutSession);

module.exports = router;
