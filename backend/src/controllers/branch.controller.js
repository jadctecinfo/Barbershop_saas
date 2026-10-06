const branchService = require("../services/branch.service");
 
 
// ======================================
// OBTENER SUCURSALES POR TENANT
// ======================================
 
async function getBranchesByTenant(req, res) {
try {
const { tenantId } = req.params;
 
const result = await branchService.getBranchesByTenantId(tenantId);
 
if (!result) {
return res.status(404).json({
ok: false,
message: "Barbería no encontrada"
});
}
 
return res.status(200).json({
ok: true,
tenant: result.tenant,
data: result.branches
});
} catch (error) {
console.error("Error obteniendo sucursales:", error.message);
 
return res.status(500).json({
ok: false,
message: "Error interno del servidor"
});
}
}
 
 
// ======================================
// CREAR SUCURSAL
// ======================================
 
async function createBranch(req, res) {
try {
const { tenantId } = req.params;
 
const {
nombre,
direccion,
ciudad,
telefono,
google_maps_url
} = req.body;
 
// Validar tenantId
const parsedTenantId = Number(tenantId);
 
if (!Number.isInteger(parsedTenantId) || parsedTenantId <= 0) {
return res.status(400).json({
ok: false,
message: "El identificador de la barbería no es válido"
});
}
 
// Validar campos obligatorios
if (
typeof nombre !== "string" ||
typeof direccion !== "string" ||
typeof ciudad !== "string" ||
!nombre.trim() ||
!direccion.trim() ||
!ciudad.trim()
) {
return res.status(400).json({
ok: false,
message: "Nombre, dirección y ciudad son obligatorios"
});
}
 
const result = await branchService.createBranch(
parsedTenantId,
{
nombre: nombre.trim(),
direccion: direccion.trim(),
ciudad: ciudad.trim(),
telefono: telefono?.trim() || null,
google_maps_url: google_maps_url?.trim() || null
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
message: "Sucursal creada correctamente",
data: {
id: result.id,
tenant_id: parsedTenantId
}
});
} catch (error) {
console.error("Error creando sucursal:", error.message);
 
return res.status(500).json({
ok: false,
message: "Error interno del servidor"
});
}
}
 
// ======================================
// ACTUALIZAR SUCURSAL
// ======================================
 
async function updateBranch(req, res) {
try {
const { tenantId, branchId } = req.params;
 
const parsedTenantId = Number(tenantId);
const parsedBranchId = Number(branchId);
 
if (
!Number.isInteger(parsedTenantId) ||
parsedTenantId <= 0 ||
!Number.isInteger(parsedBranchId) ||
parsedBranchId <= 0
) {
return res.status(400).json({
ok: false,
message: "Los identificadores no son válidos"
});
}
 
const {
nombre,
direccion,
ciudad,
telefono,
google_maps_url
} = req.body;
 
if (
typeof nombre !== "string" ||
typeof direccion !== "string" ||
typeof ciudad !== "string" ||
!nombre.trim() ||
!direccion.trim() ||
!ciudad.trim()
) {
return res.status(400).json({
ok: false,
message: "Nombre, dirección y ciudad son obligatorios"
});
}
 
const result = await branchService.updateBranch(
parsedTenantId,
parsedBranchId,
{
nombre: nombre.trim(),
direccion: direccion.trim(),
ciudad: ciudad.trim(),
telefono: telefono?.trim() || null,
google_maps_url: google_maps_url?.trim() || null
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
 
if (result.error === "BRANCH_NOT_FOUND") {
return res.status(404).json({
ok: false,
message: "Sucursal no encontrada para esta barbería"
});
}
 
return res.status(200).json({
ok: true,
message: "Sucursal actualizada correctamente"
});
} catch (error) {
console.error("Error actualizando sucursal:", error.message);
 
return res.status(500).json({
ok: false,
message: "Error interno del servidor"
});
}
}
 
// ======================================
// EXPORTAR CONTROLLER
// ======================================
 
// ======================================
// CAMBIAR ESTADO DE SUCURSAL
// ======================================
 
async function changeBranchStatus(req, res) {
try {
const { tenantId, branchId } = req.params;
const { estado } = req.body;
 
const parsedTenantId = Number(tenantId);
const parsedBranchId = Number(branchId);
 
// Validar identificadores
if (
!Number.isInteger(parsedTenantId) ||
parsedTenantId <= 0 ||
!Number.isInteger(parsedBranchId) ||
parsedBranchId <= 0
) {
return res.status(400).json({
ok: false,
message: "Los identificadores no son válidos"
});
}
 
// Validar estado
if (!["ACTIVO", "INACTIVO"].includes(estado)) {
return res.status(400).json({
ok: false,
message: "El estado debe ser ACTIVO o INACTIVO"
});
}
 
const result = await branchService.changeBranchStatus(
parsedTenantId,
parsedBranchId,
estado
);
 
if (result.error === "TENANT_NOT_FOUND") {
return res.status(404).json({
ok: false,
message: "Barbería no encontrada"
});
}
 
if (result.error === "BRANCH_NOT_FOUND") {
return res.status(404).json({
ok: false,
message: "Sucursal no encontrada para esta barbería"
});
}
 
return res.status(200).json({
ok: true,
message: "Estado de la sucursal actualizado correctamente",
data: {
id: parsedBranchId,
tenant_id: parsedTenantId,
estado
}
});
} catch (error) {
console.error(
"Error cambiando estado de sucursal:",
error.message
);
 
return res.status(500).json({
ok: false,
message: "Error interno del servidor"
});
}
}

module.exports = {
getBranchesByTenant,
createBranch,
updateBranch,
changeBranchStatus
};