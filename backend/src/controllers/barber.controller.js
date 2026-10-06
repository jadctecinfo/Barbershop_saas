const barberService = require("../services/barber.service");
 
// ======================================
// OBTENER BARBEROS POR TENANT
// ======================================
 
async function getBarbersByTenant(req, res) {
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
await barberService.getBarbersByTenantId(
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
data: result.barbers
});
} catch (error) {
console.error(
"Error obteniendo barberos:",
error.message
);
 
return res.status(500).json({
ok: false,
message: "Error interno del servidor"
});
}
}
 
// ======================================
// CREAR BARBERO
// ======================================
 
async function createBarber(req, res) {
try {
const { tenantId } = req.params;
const parsedTenantId = Number(tenantId);
 
const {
branch_id,
user_id,
nombre_profesional,
especialidad,
foto_url
} = req.body;
 
if (
!Number.isInteger(parsedTenantId) ||
parsedTenantId <= 0
) {
return res.status(400).json({
ok: false,
message: "El identificador de la barbería no es válido"
});
}
 
if (
!Number.isInteger(branch_id) ||
branch_id <= 0
) {
return res.status(400).json({
ok: false,
message: "La sucursal no es válida"
});
}
 
if (
!Number.isInteger(user_id) ||
user_id <= 0
) {
return res.status(400).json({
ok: false,
message: "El usuario no es válido"
});
}
 
if (
typeof nombre_profesional !== "string" ||
!nombre_profesional.trim()
) {
return res.status(400).json({
ok: false,
message: "El nombre profesional es obligatorio"
});
}
 
const result = await barberService.createBarber(
parsedTenantId,
{
branch_id,
user_id,
nombre_profesional: nombre_profesional.trim(),
especialidad:
typeof especialidad === "string" &&
especialidad.trim()
? especialidad.trim()
: null,
foto_url:
typeof foto_url === "string" &&
foto_url.trim()
? foto_url.trim()
: null
}
);
 
const errors = {
TENANT_NOT_FOUND: [404, "Barbería no encontrada"],
TENANT_INACTIVE: [403, "La barbería está inactiva"],
BRANCH_NOT_FOUND: [404, "Sucursal no encontrada para esta barbería"],
BRANCH_INACTIVE: [403, "La sucursal está inactiva"],
USER_NOT_FOUND: [404, "Usuario no encontrado"],
USER_TENANT_MISMATCH: [403, "El usuario no pertenece a esta barbería"],
USER_NOT_BARBER: [400, "El usuario no tiene rol BARBERO"],
USER_INACTIVE: [403, "El usuario está inactivo"],
BARBER_PROFILE_EXISTS: [409, "El usuario ya tiene un perfil de barbero"]
};
 
if (result.error && errors[result.error]) {
const [status, message] = errors[result.error];
 
return res.status(status).json({
ok: false,
message
});
}
 
return res.status(201).json({
ok: true,
message: "Barbero creado correctamente",
data: {
id: result.id,
tenant_id: parsedTenantId
}
});
} catch (error) {
console.error(
"Error creando barbero:",
error.message
);
 
return res.status(500).json({
ok: false,
message: "Error interno del servidor"
});
}
}
 
// ======================================
// ACTUALIZAR BARBERO
// ======================================
 
async function updateBarber(req, res) {
try {
const { tenantId, barberId } = req.params;
 
const parsedTenantId = Number(tenantId);
const parsedBarberId = Number(barberId);
 
const {
branch_id,
nombre_profesional,
especialidad,
foto_url
} = req.body;
 
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
 
if (
!Number.isInteger(branch_id) ||
branch_id <= 0
) {
return res.status(400).json({
ok: false,
message: "La sucursal no es válida"
});
}
 
if (
typeof nombre_profesional !== "string" ||
!nombre_profesional.trim()
) {
return res.status(400).json({
ok: false,
message: "El nombre profesional es obligatorio"
});
}
 
const result = await barberService.updateBarber(
parsedTenantId,
parsedBarberId,
{
branch_id,
nombre_profesional: nombre_profesional.trim(),
especialidad:
typeof especialidad === "string" &&
especialidad.trim()
? especialidad.trim()
: null,
foto_url:
typeof foto_url === "string" &&
foto_url.trim()
? foto_url.trim()
: null
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
 
if (result.error === "BRANCH_NOT_FOUND") {
return res.status(404).json({
ok: false,
message: "Sucursal no encontrada para esta barbería"
});
}
 
if (result.error === "BRANCH_INACTIVE") {
return res.status(403).json({
ok: false,
message: "La sucursal está inactiva"
});
}
 
return res.status(200).json({
ok: true,
message: "Barbero actualizado correctamente"
});
} catch (error) {
console.error(
"Error actualizando barbero:",
error.message
);
 
return res.status(500).json({
ok: false,
message: "Error interno del servidor"
});
}
}
 
// ======================================
// CAMBIAR ESTADO DEL BARBERO
// ======================================
 
async function changeBarberStatus(req, res) {
try {
const { tenantId, barberId } = req.params;
const { estado } = req.body;
 
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
 
if (!["ACTIVO", "INACTIVO"].includes(estado)) {
return res.status(400).json({
ok: false,
message: "El estado debe ser ACTIVO o INACTIVO"
});
}
 
const result =
await barberService.changeBarberStatus(
parsedTenantId,
parsedBarberId,
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
 
return res.status(200).json({
ok: true,
message: "Estado del barbero actualizado correctamente",
data: {
id: parsedBarberId,
tenant_id: parsedTenantId,
estado
}
});
} catch (error) {
console.error(
"Error cambiando estado del barbero:",
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
getBarbersByTenant,
createBarber,
updateBarber,
changeBarberStatus
};