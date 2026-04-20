const express = require("express");
const cors = require("cors");

const flightsRoutes = require("./src/routes/flights.routes");
const hotelsRoutes = require("./src/routes/hotels.routes");
const trainsRoutes = require("./src/routes/trains.routes");
const cruisesRoutes = require("./src/routes/cruises.routes");
const packagesRoutes = require("./src/routes/packages.routes");
const vehiclesRoutes = require("./src/routes/vehicles.routes");
const offersRoutes = require("./src/routes/offers.routes");
const authRoutes = require("./src/routes/auth.routes");
const reservasRoutes = require("./src/routes/reservas.routes");
const contactRoutes = require("./src/routes/contact.routes");
const favoritesRoutes = require("./src/routes/favorites.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/flights", flightsRoutes);
app.use("/api/hotels", hotelsRoutes);
app.use("/api/trains", trainsRoutes);
app.use("/api/cruises", cruisesRoutes);
app.use("/api/packages", packagesRoutes);
app.use("/api/vehicles", vehiclesRoutes);
app.use("/api/offers", offersRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/reservas", reservasRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/favoritos", favoritesRoutes);

app.get("/", (req, res) => {
  res.send("API NebriViajes activa");
});

// Error handler (para que el frontend reciba JSON con message)
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);

  // Errores típicos de mongoose
  if (err?.name === "CastError") {
    return res.status(400).json({ message: "ID no válido" });
  }
  if (err?.name === "ValidationError") {
    return res.status(400).json({ message: err.message || "Datos no válidos" });
  }

  const status = err.statusCode || err.status || 500;
  res.status(status).json({ message: err.message || "Error interno del servidor" });
});

module.exports = app;
