const ContactMessage = require("../models/contactMessage.model");

// POST /api/contact
// Guarda el mensaje en Mongo y devuelve una respuesta simple para el frontend.
const sendContactMessage = async (req, res, next) => {
  try {
    const { name, email, topic, message } = req.body || {};

    if (!name || !email || !message) {
      return res.status(400).json({ message: "Faltan campos obligatorios" });
    }

    await ContactMessage.create({
      name: String(name).trim(),
      email: String(email).trim(),
      topic: String(topic || "general").trim(),
      message: String(message).trim(),
    });

    return res.status(201).json({
      ok: true,
      message: "¡Mensaje enviado! Te responderemos lo antes posible.",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  sendContactMessage,
};
