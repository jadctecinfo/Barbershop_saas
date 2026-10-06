const scheduleRepository = require("../repositories/schedule.repository");
const barberRepository = require("../repositories/barber.repository");
const serviceRepository = require("../repositories/service.repository");
const appointmentRepository = require("../repositories/appointment.repository");
 
// ======================================
// CONVERTIR HH:MM:SS A MINUTOS
// ======================================
 
function timeToMinutes(time) {
const parts = time.split(":");
 
const hours = Number(parts[0]);
const minutes = Number(parts[1]);
 
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
// OBTENER DÍA DE LA SEMANA
// ======================================
 
function getDayName(dateString) {
const date = new Date(`${dateString}T12:00:00`);
 
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
// CALCULAR DISPONIBILIDAD
// ======================================
 
async function getAvailability(
tenantId,
barberId,
serviceId,
dateString
) {
// --------------------------------------
// Validar barbero
// --------------------------------------
 
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
 
if (barber.estado !== "ACTIVO") {
return {
error: "BARBER_INACTIVE"
};
}
 
// --------------------------------------
// Validar servicio
// --------------------------------------
 
const service =
await serviceRepository.findByIdAndTenantId(
serviceId,
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
 
// --------------------------------------
// Obtener día solicitado
// --------------------------------------
 
const dayName = getDayName(dateString);
 
// --------------------------------------
// Consultar horario semanal
// --------------------------------------
 
const schedules =
await scheduleRepository.findByBarberAndTenantId(
barberId,
tenantId
);
 
const schedule = schedules.find(
(item) =>
item.dia_semana === dayName &&
item.estado === "ACTIVO"
);
 
// Si no existe horario, el barbero no trabaja
if (!schedule) {
return {
date: dateString,
dia_semana: dayName,
barber,
service,
slots: []
};
}
 
// --------------------------------------
// Convertir horario a minutos
// --------------------------------------
 
const startMinutes = timeToMinutes(
schedule.hora_inicio
);
 
const endMinutes = timeToMinutes(
schedule.hora_fin
);
 
const duration = Number(
service.duracion_minutos
);
 
// --------------------------------------
// Generar slots
// --------------------------------------
 
// ======================================
// GENERAR SLOTS TEORICOS
// ======================================
 
const theoreticalSlots = [];
 
let current = startMinutes;
 
while (current + duration <= endMinutes) {
theoreticalSlots.push({
hora_inicio: minutesToTime(current),
hora_fin: minutesToTime(
current + duration
)
});
 
current += duration;
}
 
// ======================================
// CONSULTAR CITAS EXISTENTES
// ======================================
 
const appointments =
await appointmentRepository.findByBarberAndDate(
tenantId,
barberId,
dateString
);
 
// ======================================
// FILTRAR CITAS QUE BLOQUEAN HORARIOS
// ======================================
 
const blockingAppointments = appointments.filter(
(appointment) =>
appointment.estado === "PENDIENTE" ||
appointment.estado === "CONFIRMADA"
);
 
// ======================================
// ELIMINAR SLOTS OCUPADOS
// ======================================
 
const slots = theoreticalSlots.filter((slot) => {
const slotStart = timeToMinutes(
slot.hora_inicio
);
 
const slotEnd = timeToMinutes(
slot.hora_fin
);
 
const hasConflict = blockingAppointments.some(
(appointment) => {
const appointmentStart = timeToMinutes(
appointment.hora_inicio
);
 
const appointmentEnd = timeToMinutes(
appointment.hora_fin
);
 
return (
slotStart < appointmentEnd &&
slotEnd > appointmentStart
);
}
);
 
return !hasConflict;
});
 
return {
date: dateString,
dia_semana: dayName,
barber: {
id: barber.id,
nombre_profesional:
barber.nombre_profesional
},
service: {
id: service.id,
nombre: service.nombre,
duracion_minutos:
service.duracion_minutos,
precio: service.precio
},
horario: {
hora_inicio: schedule.hora_inicio,
hora_fin: schedule.hora_fin
},
slots
};
}
 
// ======================================
// EXPORTAR SERVICE
// ======================================
 
module.exports = {
getAvailability
};