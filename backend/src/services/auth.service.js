const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
 
const userRepository = require("../repositories/user.repository");
 
// ======================================
// INICIAR SESIÓN
// ======================================
 
async function login(email, password) {
// Buscar usuario
const user = await userRepository.findByEmail(email);
 
if (!user) {
return {
error: "INVALID_CREDENTIALS"
};
}
 
// Validar estado del usuario
if (user.estado !== "ACTIVO") {
return {
error: "USER_INACTIVE"
};
}
 
// Si pertenece a un tenant, validar que esté activo
if (
user.tenant_id !== null &&
user.tenant_estado !== "ACTIVO"
) {
return {
error: "TENANT_INACTIVE"
};
}
 
// Comparar contraseña con el hash almacenado
const passwordIsValid = await bcrypt.compare(
password,
user.password_hash
);
 
if (!passwordIsValid) {
return {
error: "INVALID_CREDENTIALS"
};
}
 
// Crear payload del token
const payload = {
user_id: user.id,
tenant_id: user.tenant_id,
rol: user.rol
};
 
// Generar JWT
const token = jwt.sign(
payload,
process.env.JWT_SECRET,
{
expiresIn: process.env.JWT_EXPIRES_IN || "8h"
}
);
 
// No devolver password_hash
return {
token,
user: {
id: user.id,
tenant_id: user.tenant_id,
nombre: user.nombre,
apellido: user.apellido,
email: user.email,
rol: user.rol,
tenant_nombre: user.tenant_nombre
}
};
}
 
// ======================================
// EXPORTAR SERVICE
// ======================================
 
module.exports = {
login
};