const scheduleService = require("../services/schedule.service");
 
// ======================================
// OBTENER HORARIOS DEL BARBERO
// ======================================
 
async function getSchedulesByBarber(req, res) {
try {
const { tenantId, barberId } = req.params;
 
const parsedTenantId = Number(tenantId);
const parsedBarberId = Number(barberId);
 
if (
!Number.isInteger(parsedTenantId) ||
parsedTenantId <= 0 ||
!Number.isInteger(parsedBarberId) ||
parsedBarberId <= 0
) {
return res.status(400).json({
ok: false,
message: "Los identificadores no son válidos"
});
}
 
const result =
await scheduleService.getSchedulesByBarber(
parsedTenantId,
parsedBarberId
);
 
if (result.error === "TENANT_NOT_FOUND") {
return res.status(404).json({
ok: false,
message: "Barbería no encontrada"
});
}
 
if (result.error === "BARBER_NOT_FOUND") {
return res.status(404).json({
ok: false,
message: "Barbero no encontrado para esta barbería"
});
}
 
return res.status(200).json({
ok: true,
tenant: result.tenant,
barber: result.barber,
data: result.schedules
});
} catch (error) {
console.error(
"Error obteniendo horarios:",
error.message
);
 
return res.status(500).json({
ok: false,
message: "Error interno del servidor"
});
}
}
 
// ======================================
// ACTUALIZAR HORARIO
// ======================================
 
async function updateSchedule(req, res) {
try {
const {
tenantId,
barberId,
scheduleId
} = req.params;
 
const parsedTenantId = Number(tenantId);
const parsedBarberId = Number(barberId);
const parsedScheduleId = Number(scheduleId);
 
if (
!Number.isInteger(parsedTenantId) ||
parsedTenantId <= 0 ||
!Number.isInteger(parsedBarberId) ||
parsedBarberId <= 0 ||
!Number.isInteger(parsedScheduleId) ||
parsedScheduleId <= 0
) {
return res.status(400).json({
ok: false,
message: "Los identificadores no son válidos"
});
}
 
const {
hora_inicio,
hora_fin
} = req.body;
 
// Formato HH:MM o HH:MM:SS
const timeRegex =
/^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/;
 
if (
typeof hora_inicio !== "string" ||
typeof hora_fin !== "string" ||
!timeRegex.test(hora_inicio) ||
!timeRegex.test(hora_fin)
) {
return res.status(400).json({
ok: false,
message:
"Las horas deben tener formato HH:MM o HH:MM:SS"
});
}
 
if (hora_fin <= hora_inicio) {
return res.status(400).json({
ok: false,
message:
"La hora final debe ser posterior a la hora inicial"
});
}
 
const result =
await scheduleService.updateSchedule(
parsedTenantId,
parsedBarberId,
parsedScheduleId,
{
hora_inicio,
hora_fin
}
);
 
if (result.error === "TENANT_NOT_FOUND") {
return res.status(404).json({
ok: false,
message: "Barbería no encontrada"
});
}
 
if (result.error === "TENANT_INACTIVE") {
return res.status(403).json({
ok: false,
message: "La barbería está inactiva"
});
}
 
if (result.error === "BARBER_NOT_FOUND") {
return res.status(404).json({
ok: false,
message: "Barbero no encontrado para esta barbería"
});
}
 
if (result.error === "SCHEDULE_NOT_FOUND") {
return res.status(404).json({
ok: false,
message: "Horario no encontrado"
});
}
 
if (
result.error === "SCHEDULE_BARBER_MISMATCH"
) {
return res.status(403).json({
ok: false,
message:
"El horario no pertenece al barbero indicado"
});
}
 
return res.status(200).json({
ok: true,
message: "Horario actualizado correctamente"
});
} catch (error) {
console.error(
"Error actualizando horario:",
error.message
);
 
return res.status(500).json({
ok: false,
message: "Error interno del servidor"
});
}
}
 
// ======================================
// CAMBIAR ESTADO DEL HORARIO
// ======================================
 
async function changeScheduleStatus(req, res) {
try {
const {
tenantId,
barberId,
scheduleId
} = req.params;
 
const { estado } = req.body;
 
const parsedTenantId = Number(tenantId);
const parsedBarberId = Number(barberId);
const parsedScheduleId = Number(scheduleId);
 
if (
!Number.isInteger(parsedTenantId) ||
parsedTenantId <= 0 ||
!Number.isInteger(parsedBarberId) ||
parsedBarberId <= 0 ||
!Number.isInteger(parsedScheduleId) ||
parsedScheduleId <= 0
) {
return res.status(400).json({
ok: false,
message: "Los identificadores no son válidos"
});
}
 
if (!["ACTIVO", "INACTIVO"].includes(estado)) {
return res.status(400).json({
ok: false,
message: "El estado debe ser ACTIVO o INACTIVO"
});
}
 
const result =
await scheduleService.changeScheduleStatus(
parsedTenantId,
parsedBarberId,
parsedScheduleId,
estado
);
 
if (result.error === "TENANT_NOT_FOUND") {
return res.status(404).json({
ok: false,
message: "Barbería no encontrada"
});
}
 
if (result.error === "BARBER_NOT_FOUND") {
return res.status(404).json({
ok: false,
message: "Barbero no encontrado para esta barbería"
});
}
 
if (result.error === "SCHEDULE_NOT_FOUND") {
return res.status(404).json({
ok: false,
message: "Horario no encontrado"
});
}
 
if (
result.error === "SCHEDULE_BARBER_MISMATCH"
) {
return res.status(403).json({
ok: false,
message:
"El horario no pertenece al barbero indicado"
});
}
 
return res.status(200).json({
ok: true,
message:
"Estado del horario actualizado correctamente",
data: {
id: parsedScheduleId,
barber_id: parsedBarberId,
tenant_id: parsedTenantId,
estado
}
});
} catch (error) {
console.error(
"Error cambiando estado del horario:",
error.message
);
 
return res.status(500).json({
ok: false,
message: "Error interno del servidor"
});
}
}
 
// ======================================
// EXPORTAR CONTROLLER
// ======================================
 
module.exports = {
getSchedulesByBarber,
updateSchedule,
changeScheduleStatus
};