const appointmentService = require(
"../services/appointment.service"
);
 
// ======================================
// CREAR RESERVA
// ======================================
 
async function createAppointment(req, res) {
try {
const { tenantId } = req.params;
 
const parsedTenantId = Number(tenantId);
 
const {
branch_id,
barber_id,
service_id,
cliente_nombre,
cliente_telefono,
cliente_email,
fecha,
hora_inicio,
notas
} = req.body;
 
// ======================================
// VALIDAR TENANT
// ======================================
 
if (
!Number.isInteger(parsedTenantId) ||
parsedTenantId <= 0
) {
return res.status(400).json({
ok: false,
message: "El identificador de la barbería no es válido"
});
}
 
// ======================================
// VALIDAR IDENTIFICADORES
// ======================================
 
if (
!Number.isInteger(branch_id) ||
branch_id <= 0 ||
!Number.isInteger(barber_id) ||
barber_id <= 0 ||
!Number.isInteger(service_id) ||
service_id <= 0
) {
return res.status(400).json({
ok: false,
message: "Sucursal, barbero y servicio son obligatorios"
});
}
 
// ======================================
// VALIDAR CLIENTE
// ======================================
 
if (
typeof cliente_nombre !== "string" ||
!cliente_nombre.trim()
) {
return res.status(400).json({
ok: false,
message: "El nombre del cliente es obligatorio"
});
}
 
if (
typeof cliente_telefono !== "string" ||
!cliente_telefono.trim()
) {
return res.status(400).json({
ok: false,
message: "El teléfono del cliente es obligatorio"
});
}
 
// ======================================
// VALIDAR FECHA
// ======================================
 
const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
 
if (
typeof fecha !== "string" ||
!dateRegex.test(fecha)
) {
return res.status(400).json({
ok: false,
message: "La fecha debe tener formato YYYY-MM-DD"
});
}
 
// ======================================
// VALIDAR HORA
// ======================================
 
const timeRegex =
/^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/;
 
if (
typeof hora_inicio !== "string" ||
!timeRegex.test(hora_inicio)
) {
return res.status(400).json({
ok: false,
message:
"La hora de inicio debe tener formato HH:MM o HH:MM:SS"
});
}
 
// ======================================
// CREAR RESERVA
// ======================================
 
const result =
await appointmentService.createAppointment(
parsedTenantId,
{
branch_id,
barber_id,
service_id,
 
cliente_nombre:
cliente_nombre.trim(),
 
cliente_telefono:
cliente_telefono.trim(),
 
cliente_email:
typeof cliente_email === "string" &&
cliente_email.trim()
? cliente_email.trim().toLowerCase()
: null,
 
fecha,
hora_inicio,
 
notas:
typeof notas === "string" &&
notas.trim()
? notas.trim()
: null
}
);
 
// ======================================
// ERRORES DE NEGOCIO
// ======================================
 
const errors = {
TENANT_NOT_FOUND: [
404,
"Barbería no encontrada"
],
 
TENANT_INACTIVE: [
403,
"La barbería está inactiva"
],
 
BRANCH_NOT_FOUND: [
404,
"Sucursal no encontrada para esta barbería"
],
 
BRANCH_INACTIVE: [
403,
"La sucursal está inactiva"
],
 
BARBER_NOT_FOUND: [
404,
"Barbero no encontrado para esta barbería"
],
 
BARBER_INACTIVE: [
403,
"El barbero está inactivo"
],
 
BARBER_BRANCH_MISMATCH: [
400,
"El barbero no pertenece a la sucursal indicada"
],
 
SERVICE_NOT_FOUND: [
404,
"Servicio no encontrado para esta barbería"
],
 
SERVICE_INACTIVE: [
403,
"El servicio está inactivo"
],
 
BARBER_SERVICE_NOT_ALLOWED: [
400,
"El barbero no presta el servicio seleccionado"
],
 
BARBER_NOT_WORKING: [
409,
"El barbero no trabaja en la fecha seleccionada"
],
 
OUTSIDE_WORKING_HOURS: [
409,
"La hora seleccionada está fuera del horario laboral"
],
 
INVALID_SLOT: [
409,
"La hora seleccionada no corresponde a un horario disponible"
],
 
APPOINTMENT_CONFLICT: [
409,
"El horario seleccionado ya no está disponible"
],
 
APPOINTMENT_BUSY: [
409,
"El horario está siendo procesado. Intenta nuevamente."
]
};
 
if (
result.error &&
errors[result.error]
) {
const [status, message] =
errors[result.error];
 
return res.status(status).json({
ok: false,
message
});
}
 
// ======================================
// RESPUESTA EXITOSA
// ======================================
 
return res.status(201).json({
ok: true,
message: "Reserva creada correctamente",
data: result
});
 
} catch (error) {
console.error(
"Error creando reserva:",
error.message
);
 
return res.status(500).json({
ok: false,
message: "Error interno del servidor"
});
}
}
 
// ======================================
// CONSULTAR CITAS DEL BARBERO POR FECHA
// ======================================
 
async function getAppointmentsByBarberAndDate(
req,
res
) {
try {
const { tenantId } = req.params;
 
const {
barber_id,
fecha
} = req.query;
 
const parsedTenantId =
Number(tenantId);
 
const parsedBarberId =
Number(barber_id);
 
// ======================================
// VALIDAR IDENTIFICADORES
// ======================================
 
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
 
// ======================================
// VALIDAR FECHA
// ======================================
 
const dateRegex =
/^\d{4}-\d{2}-\d{2}$/;
 
if (
typeof fecha !== "string" ||
!dateRegex.test(fecha)
) {
return res.status(400).json({
ok: false,
message: "La fecha debe tener formato YYYY-MM-DD"
});
}
 
// ======================================
// CONSULTAR RESERVAS
// ======================================
 
const result =
await appointmentService
.getAppointmentsByBarberAndDate(
parsedTenantId,
parsedBarberId,
fecha
);
 
if (
result.error ===
"BARBER_NOT_FOUND"
) {
return res.status(404).json({
ok: false,
message:
"Barbero no encontrado para esta barbería"
});
}
 
return res.status(200).json({
ok: true,
barber: result.barber,
data: result.appointments
});
 
} catch (error) {
console.error(
"Error obteniendo reservas:",
error.message
);
 
return res.status(500).json({
ok: false,
message: "Error interno del servidor"
});
}
}
 
// ======================================
// CAMBIAR ESTADO DE RESERVA
// ======================================
 
async function changeAppointmentStatus(
req,
res
) {
try {
const {
tenantId,
appointmentId
} = req.params;
 
const { estado } = req.body;
 
const parsedTenantId =
Number(tenantId);
 
const parsedAppointmentId =
Number(appointmentId);
 
// ======================================
// VALIDAR IDENTIFICADORES
// ======================================
 
if (
!Number.isInteger(parsedTenantId) ||
parsedTenantId <= 0 ||
!Number.isInteger(parsedAppointmentId) ||
parsedAppointmentId <= 0
) {
return res.status(400).json({
ok: false,
message: "Los identificadores no son válidos"
});
}
 
// ======================================
// VALIDAR ESTADO
// ======================================
 
const allowedStates = [
"PENDIENTE",
"CONFIRMADA",
"COMPLETADA",
"CANCELADA",
"NO_ASISTIO"
];
 
if (
!allowedStates.includes(estado)
) {
return res.status(400).json({
ok: false,
message: "El estado de la reserva no es válido"
});
}
 
// ======================================
// CAMBIAR ESTADO
// ======================================
 
const result =
await appointmentService
.changeAppointmentStatus(
parsedTenantId,
parsedAppointmentId,
estado
);
 
if (
result.error ===
"APPOINTMENT_NOT_FOUND"
) {
return res.status(404).json({
ok: false,
message: "Reserva no encontrada"
});
}
 
return res.status(200).json({
ok: true,
message:
"Estado de la reserva actualizado correctamente",
data: {
id: parsedAppointmentId,
estado
}
});
 
} catch (error) {
console.error(
"Error cambiando estado de reserva:",
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
createAppointment,
getAppointmentsByBarberAndDate,
changeAppointmentStatus
};