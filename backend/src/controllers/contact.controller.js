const { supabase } = require("../db/supabase");

const sendContactMessage = async (req, res, next) => {
  try {
    const { name, email, topic, subject, message } = req.body || {};
    if (!name || !email || !message) return res.status(400).json({ message: "Faltan campos obligatorios" });

    const { error } = await supabase.from("contact_messages").insert({
      name: String(name).trim(),
      email: String(email).trim(),
      subject: String(subject || topic || "general").trim(),
      message: String(message).trim(),
    });
    if (error) throw error;
    return res.status(201).json({ ok: true, message: "¡Mensaje enviado! Te responderemos lo antes posible." });
  } catch (error) { next(error); }
};
module.exports = { sendContactMessage };
