const mongoose = require("mongoose");

const PackageSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    destination: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    startDate: {
      type: String, // mantenemos string por compatibilidad
      required: true,
      index: true,
    },
    durationDays: {
      type: Number,
      required: true,
      min: 1,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
      index: true,
    },
    includes: {
      type: [String],
      default: [],
    },
    image: {
      type: String,
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

module.exports = mongoose.model("Package", PackageSchema);
