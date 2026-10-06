const express = require("express");
 
const branchController = require("../controllers/branch.controller");
 
const authenticate = require("../middlewares/authenticate.middleware");
const authorize = require("../middlewares/authorize.middleware");
const tenantAccess = require("../middlewares/tenant-access.middleware");
 
const router = express.Router({
mergeParams: true,
});
 
// Autenticación
router.use(authenticate);
 
// Autorización por rol
router.use(
authorize("SUPERADMIN", "ADMIN_BARBERIA")
);
 
// Validación de acceso a la barbería
router.use(tenantAccess);
 
// Consultar sucursales de una barbería
router.get("/", branchController.getBranchesByTenant);
 
// Crear una sucursal para una barbería
router.post("/", branchController.createBranch);
 
// Actualizar una sucursal de una barbería
router.put("/:branchId", branchController.updateBranch);
 
// Activar o desactivar una sucursal
router.patch(
"/:branchId/status",
branchController.changeBranchStatus
);
 
module.exports = router;