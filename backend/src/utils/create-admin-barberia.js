require("dotenv").config();
 
const bcrypt = require("bcrypt");
const pool = require("../config/database");
 
async function createAdminBarberia() {
try {
const tenantId = 1;
 
const email = "admin@thebrothers.local";
const password = "AdminBrothers2026";
 
// ======================================
// VERIFICAR TENANT
// ======================================
 
const [tenants] = await pool.execute(
`
SELECT
id,
nombre,
estado
FROM tenants
WHERE id = ?
LIMIT 1
`,
[tenantId]
);
 
if (tenants.length === 0) {
throw new Error("La barbería no existe");
}
 
const tenant = tenants[0];
 
if (tenant.estado !== "ACTIVO") {
throw new Error("La barbería está inactiva");
}
 
// ======================================
// BUSCAR ROL ADMIN_BARBERIA
// ======================================
 
const [roles] = await pool.execute(
`
SELECT id
FROM roles
WHERE nombre = ?
LIMIT 1
`,
["ADMIN_BARBERIA"]
);
 
if (roles.length === 0) {
throw new Error("El rol ADMIN_BARBERIA no existe");
}
 
const roleId = roles[0].id;
 
// ======================================
// COMPROBAR EMAIL
// ======================================
 
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
console.log("El ADMIN_BARBERIA ya existe.");
return;
}
 
// ======================================
// GENERAR HASH
// ======================================
 
const passwordHash = await bcrypt.hash(password, 10);
 
// ======================================
// CREAR USUARIO
// ======================================
 
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
"Administrador",
"The Brothers",
email,
null,
passwordHash
]
);
 
console.log("");
console.log("======================================");
console.log(" ADMIN_BARBERIA CREADO");
console.log("======================================");
console.log(`ID usuario: ${result.insertId}`);
console.log(`Email: ${email}`);
console.log(`Tenant ID: ${tenant.id}`);
console.log(`Barbería: ${tenant.nombre}`);
console.log("Rol: ADMIN_BARBERIA");
console.log("======================================");
console.log("");
 
} catch (error) {
console.error("Error creando ADMIN_BARBERIA:");
console.error(error.message);
} finally {
await pool.end();
}
}
 
createAdminBarberia();
