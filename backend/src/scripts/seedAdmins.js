require("dotenv").config();
const mongoose = require("mongoose");
const AdminEmail = require("../models/adminEmail.model");

const emails = [
  // Cambia estos 4 correos por los del grupo:
  "tu-correo@ejemplo.com",
  "integrante1@ejemplo.com",
  "integrante2@ejemplo.com",
  "integrante3@ejemplo.com",
].map((email) => email.trim().toLowerCase());

async function main() {
  await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/nebriviajes");

  for (const email of emails) {
    await AdminEmail.updateOne({ email }, { email }, { upsert: true });
    console.log(`Admin guardado: ${email}`);
  }

  await mongoose.disconnect();
  console.log("Listo. Correos de administrador insertados en adminemails.");
}

main().catch(async (err) => {
  console.error(err);
  await mongoose.disconnect();
  process.exit(1);
});
