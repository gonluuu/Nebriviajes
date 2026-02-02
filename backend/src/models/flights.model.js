// La base de todo

const mongoose = require("mongoose");

const FlightsSchema = new mongoose.Schema(
  {
    origin: {
      type: String,
      required: true,
    },
    destination: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
      index: true,
    },
    departureDate: {
      type: Date,
      required: true,
    },
    fechaVuelta: {
      type: Date,
      required: true,
    },
    duracion: {
      type: String,
      trim: true,
    },
    disponible: {
      type: String,
      trim: true,
    },
    aerolinea: {
      type: String,
      trim: true,
    },
    precio: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Flight", FlightsSchema);
