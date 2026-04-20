const mongoose = require("mongoose");

const ReservaSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ["hotel", "flight", "train", "vehicle", "cruise", "package", "offer"],
      index: true,
    },
    originalId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    // Copia (snapshot) del documento reservado para poder consultarlo aunque se borre del catálogo
    snapshot: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    // Opcional si luego quieres asociarlo a usuarios
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },
  },
  {
    timestamps: true, // createdAt = fecha de reserva
  },
);

module.exports = mongoose.model("Reserva", ReservaSchema);
