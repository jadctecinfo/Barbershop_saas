const express = require("express");
 
const barberController = require("../controllers/barber.controller");
 
const authenticate = require("../middlewares/authenticate.middleware");
const authorize = require("../middlewares/authorize.middleware");
const tenantAccess = require("../middlewares/tenant-access.middleware");
 
const router = express.Router({
mergeParams: true
});
 
// ======================================
// SEGURIDAD
// ======================================
 
router.use(authenticate);
 
router.use(
authorize("SUPERADMIN", "ADMIN_BARBERIA")
);
 
router.use(tenantAccess);
 
// ======================================
// CONSULTAR BARBEROS
// ======================================
 
router.get(
"/",
barberController.getBarbersByTenant
);
 
// ======================================
// CREAR PERFIL DE BARBERO
// ======================================
 
router.post(
"/",
barberController.createBarber
);
 
// ======================================
// ACTUALIZAR PERFIL
// ======================================
 
router.put(
"/:barberId",
barberController.updateBarber
);
 
// ======================================
// ACTIVAR / DESACTIVAR
// ======================================
 
router.patch(
"/:barberId/status",
barberController.changeBarberStatus
);
 
module.exports = router;