const mongoose = require("mongoose")

const ViajeSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true
  },
  descripcion: {
    type: String
  },
  fechaInicio: {
    type: Date,
    required: true
  },
  fechaFin: {
    type: Date,
    required: true
  },
  precio: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
})

module.exports = mongoose.model("Viaje", ViajeSchema)
