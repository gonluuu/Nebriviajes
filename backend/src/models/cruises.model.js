const mongoose = require("mongoose");

const CruiseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      required: true,
      trim: true,
    },
    durationDays: {
      type: Number,
      required: true,
      min: 1,
    },
    origin: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    destination: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    priceFrom: {
      type: Number,
      required: true,
      min: 0,
      index: true,
    },
    countries: {
      type: [String],
      default: [],
    },
    departures: {
      type: [String], // fechas como string (según tu DB actual)
      default: [],
    },
    services: {
      type: [String],
      default: [],
    },
    images: {
      type: [String],
      default: [],
    },
    available: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Cruise", CruiseSchema);
