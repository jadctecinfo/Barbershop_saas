const express = require("express");
 
const branchController = require("../controllers/branch.controller");
 
const router = express.Router({
mergeParams: true
});
 
router.get("/", branchController.getBranchesByTenant);
 
router.post("/", branchController.createBranch);
 
module.exports = router;