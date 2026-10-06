const availabilityService = require("../services/availability.service");
 
// ======================================
// CONSULTAR DISPONIBILIDAD
// ======================================
 
async function getAvailability(req, res) {
try {
const { tenantId } = req.params;
 
const {
barber_id,
service_id,
fecha
} = req.query;
 
const parsedTenantId = Number(tenantId);
const parsedBarberId = Number(barber_id);
const parsedServiceId = Number(service_id);
 
// ======================================
// VALIDAR IDENTIFICADORES
// ======================================
 
if (
!Number.isInteger(parsedTenantId) ||
parsedTenantId <= 0 ||
!Number.isInteger(parsedBarberId) ||
parsedBarberId <= 0 ||
!Number.isInteger(parsedServiceId) ||
parsedServiceId <= 0
) {
return res.status(400).json({
ok: false,
message: "Los identificadores no son válidos"
});
}
 
// ======================================
// VALIDAR FECHA YYYY-MM-DD
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
// CONSULTAR DISPONIBILIDAD
// ======================================
 
const result =
await availabilityService.getAvailability(
parsedTenantId,
parsedBarberId,
parsedServiceId,
fecha
);
 
// ======================================
// ERRORES DE NEGOCIO
// ======================================
 
if (result.error === "BARBER_NOT_FOUND") {
return res.status(404).json({
ok: false,
message: "Barbero no encontrado para esta barbería"
});
}
 
if (result.error === "BARBER_INACTIVE") {
return res.status(403).json({
ok: false,
message: "El barbero está inactivo"
});
}
 
if (result.error === "SERVICE_NOT_FOUND") {
return res.status(404).json({
ok: false,
message: "Servicio no encontrado para esta barbería"
});
}
 
if (result.error === "SERVICE_INACTIVE") {
return res.status(403).json({
ok: false,
message: "El servicio está inactivo"
});
}
 
// ======================================
// RESPUESTA
// ======================================
 
return res.status(200).json({
ok: true,
data: result
});
 
} catch (error) {
console.error(
"Error calculando disponibilidad:",
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
getAvailability
};