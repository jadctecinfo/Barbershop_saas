const branchRepository = require("../repositories/branch.repository");
 
async function getBranchesByTenantId(tenantId) {
const branches = await branchRepository.findByTenantId(tenantId);
 
return branches;
}
 
module.exports = {
getBranchesByTenantId
};