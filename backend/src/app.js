const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
 
const pool = require("./config/database");
 
const tenantRoutes = require("./routes/tenant.routes");
const branchRoutes = require("./routes/branch.routes");
const authRoutes = require("./routes/auth.routes");
const serviceRoutes = require("./routes/service.routes");
const barberRoutes = require("./routes/barber.routes");
const scheduleRoutes = require("./routes/schedule.routes");
const availabilityRoutes = require("./routes/availability.routes");
const appointmentRoutes = require("./routes/appointment.routes");
const publicRoutes = require("./routes/public.routes");
 
const app = express();
 
// ==============================
// MIDDLEWARES GLOBALES
// ==============================
 
app.use(helmet());
app.use(cors());
app.use(express.json());
 
// ==============================
// RUTAS DE AUTENTICACION
// ==============================
 
app.use(
"/api/auth",
authRoutes
);
 
// ==============================
// RUTAS PUBLICAS
// ==============================
 
app.use(
"/api/public",
publicRoutes
);
 
// ==============================
// RUTAS DE TENANTS
// ==============================
 
app.use(
"/api/tenants",
tenantRoutes
);
 
// ==============================
// RUTAS DE SUCURSALES
// ==============================
 
app.use(
"/api/tenants/:tenantId/branches",
branchRoutes
);
 
// ==============================
// RUTAS DE SERVICIOS
// ==============================
 
app.use(
"/api/tenants/:tenantId/services",
serviceRoutes
);
 
// ==============================
// RUTAS DE BARBEROS
// ==============================
 
app.use(
"/api/tenants/:tenantId/barbers",
barberRoutes
);
 
// ==============================
// RUTAS DE HORARIOS
// ==============================
 
app.use(
"/api/tenants/:tenantId/barbers/:barberId/schedules",
scheduleRoutes
);
 
// ==============================
// RUTAS DE DISPONIBILIDAD
// ==============================
 
app.use(
"/api/tenants/:tenantId/availability",
availabilityRoutes
);
 
// ==============================
// RUTAS DE RESERVAS
// ==============================
 
app.use(
"/api/tenants/:tenantId/appointments",
appointmentRoutes
);
 
// ==============================
// RUTA PRINCIPAL
// ==============================
 
app.get("/", (req, res) => {
return res.status(200).json({
message: "Bienvenido a BarberShop SaaS"
});
});
 
// ==============================
// HEALTH CHECK DEL BACKEND
// ==============================
 
app.get("/api/health", (req, res) => {
return res.status(200).json({
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
 
return res.status(200).json({
ok: true,
database: true,
message: "BarberShop conectado correctamente con MySQL"
});
 
} catch (error) {
console.error(
"Error comprobando MySQL:",
error.message
);
 
return res.status(500).json({
ok: false,
database: false,
message: "Error de conexión con MySQL"
});
}
});
 
// ==============================
// EXPORTAR APLICACION
// ==============================
 
module.exports = app;