const express = require("express");
const router = express.Router();

const {
  listReservas,
  createReserva,
  restoreReserva,
} = require("../controllers/reservas.controller");

router.get("/", listReservas);
router.post("/", createReserva);
router.post("/:id/restore", restoreReserva);

module.exports = router;
