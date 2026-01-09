const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

/* ===============================
   CORS — SOLUCIÓN DEFINITIVA
================================ */
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", req.headers.origin || "*");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );
  res.header("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200); // 👈 CLAVE
  }

  next();
});

/* ===============================
   MIDDLEWARES
================================ */
app.use(express.json());

/* ===============================
   MONGODB
================================ */
mongoose.connection.on("connected", () => {
  console.log("✅ MongoDB conectado");
});

mongoose.connection.on("error", (err) => {
  console.error("❌ Mongo error:", err);
});

mongoose.connect(process.env.MONGO_URI);

/* ===============================
   RUTAS
================================ */
app.use("/api/auth", require("./routes/auth"));
app.use("/api/users", require("./routes/users"));
app.use("/api/alarms", require("./routes/alarms"));
app.use("/api/alerts", require("./routes/alerts"));
app.use("/api/admin/alerts", require("./routes/adminAlerts"));
app.use("/api/devices", require("./routes/devices"));
app.use("/api/emergency-codes", require("./routes/emergencyCodes"));

app.get("/", (req, res) => {
  res.json({ message: "API Alarma Smart funcionando" });
});

/* ===============================
   START
================================ */
const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 API escuchando en puerto ${PORT}`);
});
