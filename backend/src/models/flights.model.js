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
    dateReturn: {
      type: Date,
      required: true,
    },
    duration: {
      type: String,
      trim: true,
    },
    available: {
      type: Boolean,
      trim: true,
    },
    imageUrl: {
      type: String,
      trim: true,
      default: "",
    },
    airline: {
      type: String,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Flight", FlightsSchema);
