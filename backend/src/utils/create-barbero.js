require("dotenv").config();
 
const bcrypt = require("bcrypt");
const pool = require("../config/database");
 
async function createBarbero() {
try {
const tenantId = 1;
 
const email = "barbero1@thebrothers.local";
const password = "barber0012026";
 
// Verificar tenant
const [tenants] = await pool.execute(
`
SELECT id, nombre, estado
FROM tenants
WHERE id = ?
LIMIT 1
`,
[tenantId]
);
 
if (tenants.length === 0) {
throw new Error("La barbería no existe");
}
 
if (tenants[0].estado !== "ACTIVO") {
throw new Error("La barbería está inactiva");
}
 
// Buscar rol BARBERO
const [roles] = await pool.execute(
`
SELECT id
FROM roles
WHERE nombre = ?
LIMIT 1
`,
["BARBERO"]
);
 
if (roles.length === 0) {
throw new Error("El rol BARBERO no existe");
}
 
const roleId = roles[0].id;
 
// Verificar email
const [existingUsers] = await pool.execute(
`
SELECT id
FROM users
WHERE email = ?
LIMIT 1
`,
[email]
);
 
if (existingUsers.length > 0) {
console.log("El usuario BARBERO ya existe.");
return;
}
 
// Generar hash
const passwordHash = await bcrypt.hash(password, 10);
 
// Crear usuario
const [result] = await pool.execute(
`
INSERT INTO users (
tenant_id,
role_id,
nombre,
apellido,
email,
telefono,
password_hash,
estado
)
VALUES (?, ?, ?, ?, ?, ?, ?, 'ACTIVO')
`,
[
tenantId,
roleId,
"Carlos",
"Barbero",
email,
"+57 3001112233",
passwordHash
]
);
 
console.log("");
console.log("======================================");
console.log(" USUARIO BARBERO CREADO");
console.log("======================================");
console.log(`ID usuario: ${result.insertId}`);
console.log(`Email: ${email}`);
console.log(`Tenant ID: ${tenantId}`);
console.log("Rol: BARBERO");
console.log("======================================");
console.log("");
 
} catch (error) {
console.error("Error creando usuario BARBERO:");
console.error(error.message);
} finally {
await pool.end();
}
}
 
createBarbero();