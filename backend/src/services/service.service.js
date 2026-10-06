const serviceRepository = require("../repositories/service.repository");
const tenantRepository = require("../repositories/tenant.repository");
 
// ======================================
// OBTENER SERVICIOS POR TENANT
// ======================================
 
async function getServicesByTenantId(tenantId) {
const tenant = await tenantRepository.findById(tenantId);
 
if (!tenant) {
return {
error: "TENANT_NOT_FOUND"
};
}
 
const services = await serviceRepository.findByTenantId(tenantId);
 
return {
tenant,
services
};
}
 
// ======================================
// CREAR SERVICIO
// ======================================
 
async function createService(tenantId, serviceData) {
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
 
const serviceId = await serviceRepository.create(
tenantId,
serviceData
);
 
return {
id: serviceId
};
}
 
// ======================================
// ACTUALIZAR SERVICIO
// ======================================
 
async function updateService(tenantId, serviceId, serviceData) {
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
 
const service = await serviceRepository.findByIdAndTenantId(
serviceId,
tenantId
);
 
if (!service) {
return {
error: "SERVICE_NOT_FOUND"
};
}
 
const affectedRows = await serviceRepository.update(
serviceId,
tenantId,
serviceData
);
 
return {
updated: affectedRows > 0
};
}
 
// ======================================
// CAMBIAR ESTADO DEL SERVICIO
// ======================================
 
async function changeServiceStatus(
tenantId,
serviceId,
estado
) {
const tenant = await tenantRepository.findById(tenantId);
 
if (!tenant) {
return {
error: "TENANT_NOT_FOUND"
};
}
 
const service = await serviceRepository.findByIdAndTenantId(
serviceId,
tenantId
);
 
if (!service) {
return {
error: "SERVICE_NOT_FOUND"
};
}
 
const affectedRows = await serviceRepository.updateStatus(
serviceId,
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
getServicesByTenantId,
createService,
updateService,
changeServiceStatus
};