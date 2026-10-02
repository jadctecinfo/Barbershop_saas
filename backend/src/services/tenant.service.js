
// ==============================
// LOGICA DEL NEGOCIO
// ==============================

const tenantRepository = require("../repositories/tenant.repository");
 
async function getAllTenants() {
const tenants = await tenantRepository.findAll();
 
return tenants;
}
 
module.exports = {
getAllTenants
};