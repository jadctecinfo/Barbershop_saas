const branchService = require("../services/branch.service");
 
async function getBranchesByTenant(req, res) {
try {
const { tenantId } = req.params;
 
const branches = await branchService.getBranchesByTenantId(tenantId);
 
res.status(200).json({
ok: true,
tenant_id: Number(tenantId),
data: branches
});
} catch (error) {
console.error("Error obteniendo sucursales:", error.message);
 
res.status(500).json({
ok: false,
message: "Error interno del servidor"
});
}
}
 
module.exports = {
getBranchesByTenant
};