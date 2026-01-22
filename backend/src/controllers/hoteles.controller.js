const Hotel = require("../models/hotel")

// GET /api/hoteles
const getHoteles = async (req, res) => {
  const hoteles = await Hotel.find()
  res.json(hoteles)
}

// GET /api/hoteles/:id
const getHotelById = async (req, res) => {
  const hotel = await Hotel.findById(req.params.id)

  if (!hotel) {
    return res.status(404).json({ message: "Hotel no encontrado" })
  }

  res.json(hotel)
}

// POST /api/hoteles
const createHotel = async (req, res) => {
  const hotel = new Hotel(req.body)
  const hotelGuardado = await hotel.save()

  res.status(201).json(hotelGuardado)
}

module.exports = {
  getHoteles,
  getHotelById,
  createHotel
}
