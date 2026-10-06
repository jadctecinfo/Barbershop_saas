const authService = require("../services/auth.service");
 
// ======================================
// LOGIN
// ======================================
 
async function login(req, res) {
try {
const { email, password } = req.body;
 
// Validar datos obligatorios
if (
typeof email !== "string" ||
typeof password !== "string" ||
!email.trim() ||
!password
) {
return res.status(400).json({
ok: false,
message: "Correo y contraseña son obligatorios"
});
}
 
const result = await authService.login(
email.trim().toLowerCase(),
password
);
 
if (result.error === "INVALID_CREDENTIALS") {
return res.status(401).json({
ok: false,
message: "Correo o contraseña incorrectos"
});
}
 
if (result.error === "USER_INACTIVE") {
return res.status(403).json({
ok: false,
message: "El usuario está inactivo"
});
}
 
if (result.error === "TENANT_INACTIVE") {
return res.status(403).json({
ok: false,
message: "La barbería está inactiva"
});
}
 
return res.status(200).json({
ok: true,
message: "Inicio de sesión correcto",
token: result.token,
user: result.user
});
 
} catch (error) {
console.error("Error iniciando sesión:", error.message);
 
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
login
};