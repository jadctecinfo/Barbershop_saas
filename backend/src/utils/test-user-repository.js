require("dotenv").config();
 
const pool = require("../config/database");
const userRepository = require("../repositories/user.repository");
 
async function testUserRepository() {
try {
const user = await userRepository.findByEmail(
"admin@thebrothers.local"
);
 
if (!user) {
console.log("Usuario no encontrado");
return;
}
 
console.log("");
console.log("======================================");
console.log(" PRUEBA USER REPOSITORY");
console.log("======================================");
 
console.log({
id: user.id,
tenant_id: user.tenant_id,
nombre: user.nombre,
apellido: user.apellido,
email: user.email,
estado: user.estado,
rol: user.rol,
tenant_nombre: user.tenant_nombre,
tenant_estado: user.tenant_estado
});
 
console.log("======================================");
 
} catch (error) {
console.error("Error probando userRepository:");
console.error(error.message);
} finally {
await pool.end();
}
}
 
testUserRepository();