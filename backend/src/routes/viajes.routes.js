const express = require("express")
const router = express.Router()

const {
  getViajes,
  getViajeById,
  createViaje,
  updateViaje,
  deleteViaje
} = require("../controllers/viajes.controller")

router.get("/", getViajes)
router.get("/:id", getViajeById)
router.post("/", createViaje)
router.put("/:id", updateViaje)
router.delete("/:id", deleteViaje)

module.exports = router
