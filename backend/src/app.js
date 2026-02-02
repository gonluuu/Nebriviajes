const express = require("express");
const cors = require("cors");

const flightsRoutes = require("./routes/flights.routes");
const hotelsRoutes = require("./routes/hotels.routes");
const trainsRoutes = require("./routes/trains.routes");
const cruisesRoutes = require("./routes/cruises.routes");
const packagesRoutes = require("./routes/packages.routes");
const vehiclesRoutes = require("./routes/vehicles.routes");
const offersRoutes = require("./routes/offers.routes");

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

app.get("/", (req, res) => {
  res.send("API NebriViajes activa");
});

const errorHandler = require("./middlewares/errorHandler");
app.use(errorHandler);

module.exports = app;
