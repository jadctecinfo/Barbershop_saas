const barberRepository = require("../repositories/barber.repository");
const tenantRepository = require("../repositories/tenant.repository");
const branchRepository = require("../repositories/branch.repository");
const userRepository = require("../repositories/user.repository");
 
// ======================================
// OBTENER BARBEROS POR TENANT
// ======================================
 
async function getBarbersByTenantId(tenantId) {
const tenant = await tenantRepository.findById(tenantId);
 
if (!tenant) {
return {
error: "TENANT_NOT_FOUND"
};
}
 
const barbers = await barberRepository.findByTenantId(
tenantId
);
 
return {
tenant,
barbers
};
}
 
// ======================================
// CREAR PERFIL PROFESIONAL
// ======================================
 
async function createBarber(tenantId, barberData) {
const {
branch_id,
user_id
} = barberData;
 
// Validar tenant
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
 
// Validar sucursal dentro del mismo tenant
const branch = await branchRepository.findByIdAndTenantId(
branch_id,
tenantId
);
 
if (!branch) {
return {
error: "BRANCH_NOT_FOUND"
};
}
 
if (branch.estado !== "ACTIVO") {
return {
error: "BRANCH_INACTIVE"
};
}
 
// Validar usuario
const user = await userRepository.findById(user_id);
 
if (!user) {
return {
error: "USER_NOT_FOUND"
};
}
 
// El usuario debe pertenecer al mismo tenant
if (Number(user.tenant_id) !== Number(tenantId)) {
return {
error: "USER_TENANT_MISMATCH"
};
}
 
// El usuario debe tener rol BARBERO
if (user.rol !== "BARBERO") {
return {
error: "USER_NOT_BARBER"
};
}
 
if (user.estado !== "ACTIVO") {
return {
error: "USER_INACTIVE"
};
}
 
// Evitar dos perfiles para el mismo usuario
const existingBarbers =
await barberRepository.findByTenantId(tenantId);
 
const existingProfile = existingBarbers.find(
(barber) => Number(barber.user_id) === Number(user_id)
);
 
if (existingProfile) {
return {
error: "BARBER_PROFILE_EXISTS"
};
}
 
// Crear perfil
const barberId = await barberRepository.create(
tenantId,
barberData
);
 
return {
id: barberId
};
}
 
// ======================================
// ACTUALIZAR PERFIL PROFESIONAL
// ======================================
 
async function updateBarber(
tenantId,
barberId,
barberData
) {
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
 
const barber = await barberRepository.findByIdAndTenantId(
barberId,
tenantId
);
 
if (!barber) {
return {
error: "BARBER_NOT_FOUND"
};
}
 
const branch = await branchRepository.findByIdAndTenantId(
barberData.branch_id,
tenantId
);
 
if (!branch) {
return {
error: "BRANCH_NOT_FOUND"
};
}
 
if (branch.estado !== "ACTIVO") {
return {
error: "BRANCH_INACTIVE"
};
}
 
const affectedRows = await barberRepository.update(
barberId,
tenantId,
barberData
);
 
return {
updated: affectedRows > 0
};
}
 
// ======================================
// CAMBIAR ESTADO DEL BARBERO
// ======================================
 
async function changeBarberStatus(
tenantId,
barberId,
estado
) {
const tenant = await tenantRepository.findById(tenantId);
 
if (!tenant) {
return {
error: "TENANT_NOT_FOUND"
};
}
 
const barber = await barberRepository.findByIdAndTenantId(
barberId,
tenantId
);
 
if (!barber) {
return {
error: "BARBER_NOT_FOUND"
};
}
 
const affectedRows = await barberRepository.updateStatus(
barberId,
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
getBarbersByTenantId,
createBarber,
updateBarber,
changeBarberStatus
};