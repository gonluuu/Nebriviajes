const mongoose = require("mongoose");

const HotelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    address: {
      type: String,
      trim: true,
      default: "",
    },
    latitude: {
      type: Number,
      min: -90,
      max: 90,
      default: null,
    },
    longitude: {
      type: Number,
      min: -180,
      max: 180,
      default: null,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
      index: true,
    },
    date: {
      type: String,
      required: true,
    },
    available: {
      type: Boolean,
      default: true,
      index: true,
    },
    imageUrl: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Hotel", HotelSchema);
