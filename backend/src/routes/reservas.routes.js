const express = require("express");
const router = express.Router();

const {
  listReservas,
  createReserva,
  restoreReserva,
} = require("../controllers/reservas.controller");
const { requireAuth } = require("../middleware/auth.middleware");

router.get("/", requireAuth, listReservas);
router.post("/", requireAuth, createReserva);
router.post("/:id/restore", requireAuth, restoreReserva);

module.exports = router;
