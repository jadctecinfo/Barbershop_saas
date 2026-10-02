const tenantService = require("../services/tenant.service");
 
async function getAllTenants(req, res) {
try {
const tenants = await tenantService.getAllTenants();
 
res.status(200).json({
ok: true,
data: tenants
});
} catch (error) {
console.error("Error obteniendo tenants:", error.message);
 
res.status(500).json({
ok: false,
message: "Error interno del servidor"
});
}
}
 
module.exports = {
getAllTenants
};