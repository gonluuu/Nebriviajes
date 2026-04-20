const { Schema, model } = require("mongoose");

/**
 * Mensajes de contacto.
 * Guardamos lo justo para poder demostrar que "se envía" y queda registrado.
 */
const ContactMessageSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    topic: { type: String, default: "general", trim: true },
    message: { type: String, required: true, trim: true },
  },
  { timestamps: true },
);

module.exports = model("ContactMessage", ContactMessageSchema);
