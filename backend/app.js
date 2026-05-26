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
const adminRoutes = require("./src/routes/admin.routes");
const chatRoutes = require("./src/routes/chat.routes");
const paymentRoutes = require("./src/routes/payment.routes");

const app = express();
app.use(cors());
app.use(express.json({ limit: "2mb" }));

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
app.use("/api/admin", adminRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/payments", paymentRoutes);

app.get("/", (req, res) => res.send("API NebriViajes Supabase activa"));
app.get("/api/health", (req, res) => res.json({ ok: true, message: "Backend NebriViajes funcionando" }));
app.get("/api/debug/tables", async (req, res, next) => {
  try {
    const { supabase } = require("./src/db/supabase");
    const tables = ["flights", "hotels", "trains", "vehicles", "cruises", "packages", "offers", "profiles", "reservations"];
    const result = {};
    for (const table of tables) {
      const { count, error } = await supabase.from(table).select("*", { count: "exact", head: true });
      result[table] = error ? `ERROR: ${error.message}` : count;
    }
    res.json({ ok: true, tables: result });
  } catch (err) { next(err); }
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);
  const status = err.statusCode || err.status || 500;
  res.status(status).json({ message: err.message || "Error interno del servidor" });
});

module.exports = app;
