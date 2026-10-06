const branchRepository = require("../repositories/branch.repository");
const tenantRepository = require("../repositories/tenant.repository");
 
// ======================================
// OBTENER SUCURSALES POR TENANT
// ======================================
 
async function getBranchesByTenantId(tenantId) {
const tenant = await tenantRepository.findById(tenantId);
 
if (!tenant) {
return null;
}
 
const branches = await branchRepository.findByTenantId(tenantId);
 
return {
tenant,
branches
};
}
 
// ======================================
// CREAR SUCURSAL
// ======================================
 
async function createBranch(tenantId, branchData) {
const tenant = await tenantRepository.findById(tenantId);
 
if (!tenant) {
return {
error: "TENANT_NOT_FOUND"
};
}
 
if (tenant.estado !== "ACTIVO") {
return {
error: "TENANT_INACTIVE"
};
}
 
const branchId = await branchRepository.create(
tenantId,
branchData
);
 
return {
id: branchId
};
}
 
// ======================================
// ACTUALIZAR SUCURSAL
// ======================================
 
async function updateBranch(tenantId, branchId, branchData) {
const tenant = await tenantRepository.findById(tenantId);
 
if (!tenant) {
return {
error: "TENANT_NOT_FOUND"
};
}
 
if (tenant.estado !== "ACTIVO") {
return {
error: "TENANT_INACTIVE"
};
}
 
const branch = await branchRepository.findByIdAndTenantId(
branchId,
tenantId
);
 
if (!branch) {
return {
error: "BRANCH_NOT_FOUND"
};
}
 
const affectedRows = await branchRepository.update(
branchId,
tenantId,
branchData
);
 
return {
updated: affectedRows > 0
};
}
 
// ======================================
// CAMBIAR ESTADO DE SUCURSAL
// ======================================
 
async function changeBranchStatus(tenantId, branchId, estado) {
const tenant = await tenantRepository.findById(tenantId);
 
if (!tenant) {
return {
error: "TENANT_NOT_FOUND"
};
}
 
const branch = await branchRepository.findByIdAndTenantId(
branchId,
tenantId
);
 
if (!branch) {
return {
error: "BRANCH_NOT_FOUND"
};
}
 
const affectedRows = await branchRepository.updateStatus(
branchId,
tenantId,
estado
);
 
return {
updated: affectedRows > 0
};
}

// ======================================
// EXPORTAR SERVICE
// ======================================
 
module.exports = {
getBranchesByTenantId,
createBranch,
updateBranch,
changeBranchStatus
};