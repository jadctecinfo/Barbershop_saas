const express = require("express");
 
const availabilityController = require(
"../controllers/availability.controller"
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
// CONSULTAR DISPONIBILIDAD
// ======================================
 
router.get(
"/",
availabilityController.getAvailability
);
 
module.exports = router;