const Viaje = require("../models/viaje")

// GET /api/viajes
const getViajes = async (req, res) => {
  const viajes = await Viaje.find()
  res.json(viajes)
}

// GET /api/viajes/:id
const getViajeById = async (req, res) => {
  const viaje = await Viaje.findById(req.params.id)

  if (!viaje) {
    return res.status(404).json({ message: "Viaje no encontrado" })
  }

  res.json(viaje)
}

// POST /api/viajes
const createViaje = async (req, res) => {
  const viaje = new Viaje(req.body)
  const viajeGuardado = await viaje.save()

  res.status(201).json(viajeGuardado)
}

module.exports = {
  getViajes,
  getViajeById,
  createViaje
}
