const express = require("express");
 
const tenantController = require("../controllers/tenant.controller");
 
const router = express.Router();
 
router.get("/", tenantController.getAllTenants);
 
module.exports = router;