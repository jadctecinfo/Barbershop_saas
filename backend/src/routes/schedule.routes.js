const express = require("express");
 
const scheduleController = require("../controllers/schedule.controller");
 
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
// CONSULTAR HORARIOS DEL BARBERO
// ======================================
 
router.get(
"/",
scheduleController.getSchedulesByBarber
);
 
// ======================================
// ACTUALIZAR HORARIO
// ======================================
 
router.put(
"/:scheduleId",
scheduleController.updateSchedule
);
 
// ======================================
// ACTIVAR / DESACTIVAR HORARIO
// ======================================
 
router.patch(
"/:scheduleId/status",
scheduleController.changeScheduleStatus
);
 
module.exports = router;