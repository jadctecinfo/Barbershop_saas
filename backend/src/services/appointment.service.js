const appointmentRepository = require(
"../repositories/appointment.repository"
);
 
const tenantRepository = require(
"../repositories/tenant.repository"
);
 
const branchRepository = require(
"../repositories/branch.repository"
);
 
const barberRepository = require(
"../repositories/barber.repository"
);
 
const serviceRepository = require(
"../repositories/service.repository"
);
 
const scheduleRepository = require(
"../repositories/schedule.repository"
);
 
const pool = require("../config/database");
 
// ======================================
// CONVERTIR HORA A MINUTOS
// ======================================
 
function timeToMinutes(time) {
const [hours, minutes] = time
.split(":")
.map(Number);
 
return hours * 60 + minutes;
}
 
// ======================================
// CONVERTIR MINUTOS A HH:MM
// ======================================
 
function minutesToTime(totalMinutes) {
const hours = Math.floor(totalMinutes / 60);
const minutes = totalMinutes % 60;
 
return `${String(hours).padStart(2, "0")}:${String(
minutes
).padStart(2, "0")}`;
}
 
// ======================================
// OBTENER DIA DE LA SEMANA
// ======================================
 
function getDayName(dateString) {
const date = new Date(
`${dateString}T12:00:00`
);
 
const days = [
"DOMINGO",
"LUNES",
"MARTES",
"MIERCOLES",
"JUEVES",
"VIERNES",
"SABADO"
];
 
return days[date.getDay()];
}
 
// ======================================
// CREAR RESERVA
// ======================================
 
async function createAppointment(
tenantId,
appointmentData
) {
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
} = appointmentData;
 
// ======================================
// VALIDAR TENANT
// ======================================
 
const tenant =
await tenantRepository.findById(
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
 
// ======================================
// VALIDAR SUCURSAL
// ======================================
 
const branch =
await branchRepository.findByIdAndTenantId(
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
 
// ======================================
// VALIDAR BARBERO
// ======================================
 
const barber =
await barberRepository.findByIdAndTenantId(
barber_id,
tenantId
);
 
if (!barber) {
return {
error: "BARBER_NOT_FOUND"
};
}
 
if (barber.estado !== "ACTIVO") {
return {
error: "BARBER_INACTIVE"
};
}
 
// El barbero debe trabajar en la sucursal
if (
Number(barber.branch_id) !==
Number(branch_id)
) {
return {
error: "BARBER_BRANCH_MISMATCH"
};
}
 
// ======================================
// VALIDAR SERVICIO
// ======================================
 
const service =
await serviceRepository.findByIdAndTenantId(
service_id,
tenantId
);
 
if (!service) {
return {
error: "SERVICE_NOT_FOUND"
};
}
 
if (service.estado !== "ACTIVO") {
return {
error: "SERVICE_INACTIVE"
};
}
 
// ======================================
// VALIDAR BARBERO <-> SERVICIO
// ======================================
 
const [barberServices] =
await pool.execute(
`
SELECT 1
FROM barber_services
WHERE barber_id = ?
AND service_id = ?
LIMIT 1
`,
[
barber_id,
service_id
]
);
 
if (barberServices.length === 0) {
return {
error: "BARBER_SERVICE_NOT_ALLOWED"
};
}
 
// ======================================
// VALIDAR HORARIO DEL DIA
// ======================================
 
const dayName = getDayName(fecha);
 
const schedules =
await scheduleRepository.findByBarberAndTenantId(
barber_id,
tenantId
);
 
const schedule = schedules.find(
(item) =>
item.dia_semana === dayName &&
item.estado === "ACTIVO"
);
 
if (!schedule) {
return {
error: "BARBER_NOT_WORKING"
};
}
 
// ======================================
// CALCULAR HORA FINAL
// ======================================
 
const startMinutes =
timeToMinutes(hora_inicio);
 
const duration =
Number(service.duracion_minutos);
 
const endMinutes =
startMinutes + duration;
 
const hora_fin =
minutesToTime(endMinutes);
 
// ======================================
// VALIDAR HORARIO LABORAL
// ======================================
 
const scheduleStart =
timeToMinutes(
schedule.hora_inicio
);
 
const scheduleEnd =
timeToMinutes(
schedule.hora_fin
);
 
if (
startMinutes < scheduleStart ||
endMinutes > scheduleEnd
) {
return {
error: "OUTSIDE_WORKING_HOURS"
};
}
 
// ======================================
// VALIDAR QUE SEA UN SLOT CORRECTO
// ======================================
 
if (
(startMinutes - scheduleStart) %
duration !==
0
) {
return {
error: "INVALID_SLOT"
};
}
 
// ======================================
// CREAR RESERVA CON LOCK
// ======================================
 
const createResult =
await appointmentRepository.createWithLock({
tenant_id: tenantId,
branch_id,
barber_id,
service_id,
 
cliente_nombre,
cliente_telefono,
cliente_email,
 
fecha,
hora_inicio,
hora_fin,
 
// Precio histórico de la reserva
precio: service.precio,
 
notas
});
 
// ======================================
// CONFLICTO DE HORARIO
// ======================================
 
if (
createResult.error ===
"APPOINTMENT_CONFLICT"
) {
return {
error: "APPOINTMENT_CONFLICT"
};
}
 
// ======================================
// HORARIO EN PROCESAMIENTO
// ======================================
 
if (
createResult.error ===
"LOCK_TIMEOUT"
) {
return {
error: "APPOINTMENT_BUSY"
};
}
 
// ======================================
// RESPUESTA
// ======================================
 
return {
id: createResult.id,
tenant_id: tenantId,
branch_id,
barber_id,
service_id,
fecha,
hora_inicio,
hora_fin,
precio: service.precio,
estado: "PENDIENTE"
};
}
 
// ======================================
// CONSULTAR CITAS POR BARBERO Y FECHA
// ======================================
 
async function getAppointmentsByBarberAndDate(
tenantId,
barberId,
fecha
) {
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
 
const appointments =
await appointmentRepository.findByBarberAndDate(
tenantId,
barberId,
fecha
);
 
return {
barber,
appointments
};
}
 
// ======================================
// CAMBIAR ESTADO DE RESERVA
// ======================================
 
async function changeAppointmentStatus(
tenantId,
appointmentId,
estado
) {
const appointment =
await appointmentRepository.findByIdAndTenantId(
appointmentId,
tenantId
);
 
if (!appointment) {
return {
error: "APPOINTMENT_NOT_FOUND"
};
}
 
const affectedRows =
await appointmentRepository.updateStatus(
appointmentId,
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
createAppointment,
getAppointmentsByBarberAndDate,
changeAppointmentStatus
};