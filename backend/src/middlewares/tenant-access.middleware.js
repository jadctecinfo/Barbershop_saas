// ======================================
// VALIDAR ACCESO AL TENANT
// ======================================
 
function tenantAccess(req, res, next) {
if (!req.user) {
return res.status(401).json({
ok: false,
message: "Usuario no autenticado"
});
}
 
// SUPERADMIN tiene acceso global
if (req.user.rol === "SUPERADMIN") {
return next();
}
 
const requestedTenantId = Number(req.params.tenantId);
const userTenantId = Number(req.user.tenant_id);
 
if (
!Number.isInteger(requestedTenantId) ||
requestedTenantId <= 0
) {
return res.status(400).json({
ok: false,
message: "El identificador de la barbería no es válido"
});
}
 
if (userTenantId !== requestedTenantId) {
return res.status(403).json({
ok: false,
message: "No tienes acceso a esta barbería"
});
}
 
next();
}
 
module.exports = tenantAccess;