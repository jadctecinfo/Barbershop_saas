const scheduleRepository = require("../repositories/schedule.repository");
const tenantRepository = require("../repositories/tenant.repository");
const barberRepository = require("../repositories/barber.repository");
 
// ======================================
// OBTENER HORARIOS DE UN BARBERO
// ======================================
 
async function getSchedulesByBarber(
tenantId,
barberId
) {
// Validar tenant
const tenant = await tenantRepository.findById(
tenantId
);
 
if (!tenant) {
return {
error: "TENANT_NOT_FOUND"
};
}
 
// Validar que el barbero pertenece al tenant
const barber =
await barberRepository.findByIdAndTenantId(
barberId,
tenantId
);
 
if (!barber) {
return {
error: "BARBER_NOT_FOUND"
};
}
 
const schedules =
await scheduleRepository.findByBarberAndTenantId(
barberId,
tenantId
);
 
return {
tenant,
barber,
schedules
};
}
 
// ======================================
// ACTUALIZAR HORARIO
// ======================================
 
async function updateSchedule(
tenantId,
barberId,
scheduleId,
scheduleData
) {
// Validar tenant
const tenant = await tenantRepository.findById(
tenantId
);
 
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
 
// Validar barbero dentro del tenant
const barber =
await barberRepository.findByIdAndTenantId(
barberId,
tenantId
);
 
if (!barber) {
return {
error: "BARBER_NOT_FOUND"
};
}
 
// Validar horario
const schedule =
await scheduleRepository.findByIdAndTenantId(
scheduleId,
tenantId
);
 
if (!schedule) {
return {
error: "SCHEDULE_NOT_FOUND"
};
}
 
// El horario debe pertenecer al barbero solicitado
if (
Number(schedule.barber_id) !==
Number(barberId)
) {
return {
error: "SCHEDULE_BARBER_MISMATCH"
};
}
 
const affectedRows =
await scheduleRepository.update(
scheduleId,
tenantId,
scheduleData
);
 
return {
updated: affectedRows > 0
};
}
 
// ======================================
// CAMBIAR ESTADO DEL HORARIO
// ======================================
 
async function changeScheduleStatus(
tenantId,
barberId,
scheduleId,
estado
) {
const tenant = await tenantRepository.findById(
tenantId
);
 
if (!tenant) {
return {
error: "TENANT_NOT_FOUND"
};
}
 
const barber =
await barberRepository.findByIdAndTenantId(
barberId,
tenantId
);
 
if (!barber) {
return {
error: "BARBER_NOT_FOUND"
};
}
 
const schedule =
await scheduleRepository.findByIdAndTenantId(
scheduleId,
tenantId
);
 
if (!schedule) {
return {
error: "SCHEDULE_NOT_FOUND"
};
}
 
if (
Number(schedule.barber_id) !==
Number(barberId)
) {
return {
error: "SCHEDULE_BARBER_MISMATCH"
};
}
 
const affectedRows =
await scheduleRepository.updateStatus(
scheduleId,
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
getSchedulesByBarber,
updateSchedule,
changeScheduleStatus
};