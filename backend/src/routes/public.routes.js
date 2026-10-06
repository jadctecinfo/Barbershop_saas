const express = require("express");
 
const publicController = require("../controllers/public.controller");
const registrationController = require("../controllers/registration.controller");
 
const router = express.Router();
 
// ======================================
// INFORMACION PUBLICA DE LA BARBERIA
// ======================================
 
router.get(
"/barbershops/:slug",
publicController.getBarbershop
);
 
// ======================================
// SUCURSALES PUBLICAS ACTIVAS
// ======================================
 
router.get(
"/barbershops/:slug/branches",
publicController.getBranches
);
 
// ======================================
// SERVICIOS PUBLICOS ACTIVOS
// ======================================
 
router.get(
"/barbershops/:slug/services",
publicController.getServices
);
 
// ======================================
// BARBEROS PUBLICOS
// ======================================
 
router.get(
"/barbershops/:slug/barbers",
publicController.getBarbers
);
 
// ======================================
// DISPONIBILIDAD PUBLICA
// ======================================
 
router.get(
"/barbershops/:slug/availability",
publicController.getAvailability
);
 
// ======================================
// CREAR RESERVA PUBLICA
// ======================================
 
router.post(
"/barbershops/:slug/appointments",
publicController.createAppointment
);
 
// ======================================
// REGISTRAR NUEVA BARBERIA
// ======================================
 
router.post(
"/register-barbershop",
registrationController.registerBarbershop
);

// ======================================
// EXPORTAR ROUTER
// ======================================
 
module.exports = router;