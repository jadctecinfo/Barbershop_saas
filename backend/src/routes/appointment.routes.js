const express = require("express");
 
const appointmentController = require(
"../controllers/appointment.controller"
);
 
const authenticate = require(
"../middlewares/authenticate.middleware"
);
 
const authorize = require(
"../middlewares/authorize.middleware"
);
 
const tenantAccess = require(
"../middlewares/tenant-access.middleware"
);
 
const router = express.Router({
mergeParams: true
});
 
// ======================================
// SEGURIDAD
// ======================================
 
router.use(authenticate);
 
router.use(
authorize(
"SUPERADMIN",
"ADMIN_BARBERIA",
"BARBERO"
)
);
 
router.use(tenantAccess);
 
// ======================================
// CONSULTAR AGENDA DEL BARBERO
// ======================================
 
router.get(
"/",
appointmentController.getAppointmentsByBarberAndDate
);
 
// ======================================
// CREAR RESERVA
// ======================================
 
router.post(
"/",
appointmentController.createAppointment
);
 
// ======================================
// CAMBIAR ESTADO DE RESERVA
// ======================================
 
router.patch(
"/:appointmentId/status",
appointmentController.changeAppointmentStatus
);
 
module.exports = router;