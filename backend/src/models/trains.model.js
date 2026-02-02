const mongoose = require("mongoose");

const TrainSchema = new mongoose.Schema(
  {
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
    date: {
      type: String,
      required: true,
      index: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
      index: true,
    },
    duration: {
      type: String,
      required: true,
    },
    direct: {
      type: Boolean,
      default: false,
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

module.exports = mongoose.model("Train", TrainSchema);
