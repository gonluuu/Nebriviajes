const express = require("express")
const cors = require("cors")

const viajesRoutes = require("./routes/viajes.routes")
const hotelesRoutes = require("./routes/hoteles.routes")

const app = express()

app.use(cors())
app.use(express.json())

app.use("/api/viajes", viajesRoutes)
app.use("/api/hoteles", hotelesRoutes)

app.get("/", (req, res) => {
  res.send("API NebriViajes activa")
})

module.exports = app
