const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
 
const pool = require("./config/database");
 
const app = express();
 
// ==============================
// MIDDLEWARES GLOBALES
// ==============================
 
app.use(helmet());
app.use(cors());
app.use(express.json());
 
// ==============================
// RUTA PRINCIPAL
// ==============================
 
app.get("/", (req, res) => {
res.status(200).json({
message: "Bienvenido a BarberShop SaaS"
});
});
 
// ==============================
// HEALTH CHECK DEL BACKEND
// ==============================
 
app.get("/api/health", (req, res) => {
res.status(200).json({
ok: true,
message: "BarberShop API funcionando correctamente"
});
});
 
// ==============================
// HEALTH CHECK DE MYSQL
// ==============================
 
app.get("/api/health/db", async (req, res) => {
try {
await pool.query("SELECT 1");
 
res.status(200).json({
ok: true,
database: true,
message: "BarberShop conectado correctamente con MySQL"
});
} catch (error) {
console.error("Error comprobando MySQL:", error.message);
 
res.status(500).json({
ok: false,
database: false,
message: "Error de conexión con MySQL"
});
}
});
 
// ==============================
// EXPORTAR APLICACIÓN
// ==============================
 
module.exports = app;