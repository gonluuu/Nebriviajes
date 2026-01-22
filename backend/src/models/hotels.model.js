const mongoose = require("mongoose")

const HotelSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true
    },
    ciudad: {
      type: String,
      required: true
    },
    estrellas: {
      type: Number,
      min: 1,
      max: 5
    },
    precioNoche: {
      type: Number,
      required: true
    }
  },
  { timestamps: true }
)

module.exports = mongoose.model("Hotel", HotelSchema)
