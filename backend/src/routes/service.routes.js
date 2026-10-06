const express = require("express");
 
const serviceController = require("../controllers/service.controller");
 
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
// CONSULTAR SERVICIOS
// ======================================
 
router.get(
"/",
serviceController.getServicesByTenant
);
 
// ======================================
// CREAR SERVICIO
// ======================================
 
router.post(
"/",
serviceController.createService
);
 
// ======================================
// ACTUALIZAR SERVICIO
// ======================================
 
router.put(
"/:serviceId",
serviceController.updateService
);
 
// ======================================
// ACTIVAR / DESACTIVAR SERVICIO
// ======================================
 
router.patch(
"/:serviceId/status",
serviceController.changeServiceStatus
);
 
module.exports = router;