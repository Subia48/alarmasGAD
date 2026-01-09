// server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

// ===============================
// CARGAR VARIABLES DE ENTORNO
// ===============================
dotenv.config();

const app = express();

// ===============================
// CORS (OBLIGATORIO PARA VERCEL)
// ===============================
app.use(cors({
  origin: [
    "https://alarmas-6q2t4t5v-subia48s-projects.vercel.app"
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

// 🔑 PERMITIR PREFLIGHT
app.options("*", cors());

// ===============================
// BODY PARSER
// ===============================
app.use(express.json());

// ===============================
// VARIABLES
// ===============================
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

// ===============================
// CONEXIÓN A MONGODB
// ===============================
mongoose.connection.on("connected", () => {
  console.log("✅ MongoDB conectado");
  console.log("📦 Base de datos:", mongoose.connection.db.databaseName);
});

mongoose.connection.on("error", (err) => {
  console.error("❌ Error conectando a Mongo:", err);
});

mongoose.connect(MONGO_URI);

// ===============================
// RUTAS
// ===============================
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const alarmRoutes = require("./routes/alarms");
const alertRoutes = require("./routes/alerts");
const adminAlertRoutes = require("./routes/adminAlerts");
const deviceRoutes = require("./routes/devices");
const emergencyCodeRoutes = require("./routes/emergencyCodes");

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/alarms", alarmRoutes);
app.use("/api/alerts", alertRoutes);
app.use("/api/admin/alerts", adminAlertRoutes);
app.use("/api/devices", deviceRoutes);
app.use("/api/emergency-codes", emergencyCodeRoutes);

// ===============================
// RUTA DE PRUEBA
// ===============================
app.get("/", (req, res) => {
  res.json({ message: "✅ API Alarma Smart funcionando" });
});

// ===============================
// INICIAR SERVIDOR
// ===============================
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 API escuchando en http://0.0.0.0:${PORT}`);
});
