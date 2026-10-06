const serviceService = require("../services/service.service");
 
// ======================================
// OBTENER SERVICIOS POR TENANT
// ======================================
 
async function getServicesByTenant(req, res) {
try {
const { tenantId } = req.params;
 
const parsedTenantId = Number(tenantId);
 
if (
!Number.isInteger(parsedTenantId) ||
parsedTenantId <= 0
) {
return res.status(400).json({
ok: false,
message: "El identificador de la barbería no es válido"
});
}
 
const result =
await serviceService.getServicesByTenantId(
parsedTenantId
);
 
if (result.error === "TENANT_NOT_FOUND") {
return res.status(404).json({
ok: false,
message: "Barbería no encontrada"
});
}
 
return res.status(200).json({
ok: true,
tenant: result.tenant,
data: result.services
});
} catch (error) {
console.error(
"Error obteniendo servicios:",
error.message
);
 
return res.status(500).json({
ok: false,
message: "Error interno del servidor"
});
}
}
 
// ======================================
// CREAR SERVICIO
// ======================================
 
async function createService(req, res) {
try {
const { tenantId } = req.params;
 
const parsedTenantId = Number(tenantId);
 
const {
nombre,
descripcion,
duracion_minutos,
precio
} = req.body;
 
// Validar tenant
if (
!Number.isInteger(parsedTenantId) ||
parsedTenantId <= 0
) {
return res.status(400).json({
ok: false,
message: "El identificador de la barbería no es válido"
});
}
 
// Validar nombre
if (
typeof nombre !== "string" ||
!nombre.trim()
) {
return res.status(400).json({
ok: false,
message: "El nombre del servicio es obligatorio"
});
}
 
// Validar duración
if (
!Number.isInteger(duracion_minutos) ||
duracion_minutos <= 0 ||
duracion_minutos % 15 !== 0
) {
return res.status(400).json({
ok: false,
message:
"La duración debe ser un número entero positivo y múltiplo de 15 minutos"
});
}
 
// Validar precio
if (
typeof precio !== "number" ||
!Number.isFinite(precio) ||
precio < 0
) {
return res.status(400).json({
ok: false,
message: "El precio debe ser un número mayor o igual a cero"
});
}
 
const result = await serviceService.createService(
parsedTenantId,
{
nombre: nombre.trim(),
descripcion:
typeof descripcion === "string" &&
descripcion.trim()
? descripcion.trim()
: null,
duracion_minutos,
precio
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
 
return res.status(201).json({
ok: true,
message: "Servicio creado correctamente",
data: {
id: result.id,
tenant_id: parsedTenantId
}
});
} catch (error) {
console.error(
"Error creando servicio:",
error.message
);
 
return res.status(500).json({
ok: false,
message: "Error interno del servidor"
});
}
}
 
// ======================================
// ACTUALIZAR SERVICIO
// ======================================
 
async function updateService(req, res) {
try {
const { tenantId, serviceId } = req.params;
 
const parsedTenantId = Number(tenantId);
const parsedServiceId = Number(serviceId);
 
if (
!Number.isInteger(parsedTenantId) ||
parsedTenantId <= 0 ||
!Number.isInteger(parsedServiceId) ||
parsedServiceId <= 0
) {
return res.status(400).json({
ok: false,
message: "Los identificadores no son válidos"
});
}
 
const {
nombre,
descripcion,
duracion_minutos,
precio
} = req.body;
 
if (
typeof nombre !== "string" ||
!nombre.trim()
) {
return res.status(400).json({
ok: false,
message: "El nombre del servicio es obligatorio"
});
}
 
if (
!Number.isInteger(duracion_minutos) ||
duracion_minutos <= 0 ||
duracion_minutos % 15 !== 0
) {
return res.status(400).json({
ok: false,
message:
"La duración debe ser un número entero positivo y múltiplo de 15 minutos"
});
}
 
if (
typeof precio !== "number" ||
!Number.isFinite(precio) ||
precio < 0
) {
return res.status(400).json({
ok: false,
message: "El precio debe ser un número mayor o igual a cero"
});
}
 
const result = await serviceService.updateService(
parsedTenantId,
parsedServiceId,
{
nombre: nombre.trim(),
descripcion:
typeof descripcion === "string" &&
descripcion.trim()
? descripcion.trim()
: null,
duracion_minutos,
precio
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
 
if (result.error === "SERVICE_NOT_FOUND") {
return res.status(404).json({
ok: false,
message: "Servicio no encontrado para esta barbería"
});
}
 
return res.status(200).json({
ok: true,
message: "Servicio actualizado correctamente"
});
} catch (error) {
console.error(
"Error actualizando servicio:",
error.message
);
 
return res.status(500).json({
ok: false,
message: "Error interno del servidor"
});
}
}
 
// ======================================
// CAMBIAR ESTADO DEL SERVICIO
// ======================================
 
async function changeServiceStatus(req, res) {
try {
const { tenantId, serviceId } = req.params;
const { estado } = req.body;
 
const parsedTenantId = Number(tenantId);
const parsedServiceId = Number(serviceId);
 
if (
!Number.isInteger(parsedTenantId) ||
parsedTenantId <= 0 ||
!Number.isInteger(parsedServiceId) ||
parsedServiceId <= 0
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
await serviceService.changeServiceStatus(
parsedTenantId,
parsedServiceId,
estado
);
 
if (result.error === "TENANT_NOT_FOUND") {
return res.status(404).json({
ok: false,
message: "Barbería no encontrada"
});
}
 
if (result.error === "SERVICE_NOT_FOUND") {
return res.status(404).json({
ok: false,
message: "Servicio no encontrado para esta barbería"
});
}
 
return res.status(200).json({
ok: true,
message: "Estado del servicio actualizado correctamente",
data: {
id: parsedServiceId,
tenant_id: parsedTenantId,
estado
}
});
} catch (error) {
console.error(
"Error cambiando estado del servicio:",
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
getServicesByTenant,
createService,
updateService,
changeServiceStatus
};