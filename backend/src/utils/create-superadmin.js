require("dotenv").config();
 
const bcrypt = require("bcrypt");
const pool = require("../config/database");
 
async function createSuperAdmin() {
try {
const email = "admin@barbershop.local";
const password = "BarberShopsaas2026";
 
// Buscar el rol SUPERADMIN
const [roles] = await pool.execute(
`
SELECT id
FROM roles
WHERE nombre = ?
LIMIT 1
`,
["SUPERADMIN"]
);
 
if (roles.length === 0) {
throw new Error("El rol SUPERADMIN no existe");
}
 
const roleId = roles[0].id;
 
// Verificar que el correo no exista
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
console.log("El SUPERADMIN ya existe.");
return;
}
 
// Generar hash con factor 10
const passwordHash = await bcrypt.hash(password, 10);
 
// Crear SUPERADMIN
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
VALUES (
NULL,
?,
?,
?,
?,
NULL,
?,
'ACTIVO'
)
`,
[
roleId,
"Administrador",
"BarberShop",
email,
passwordHash
]
);
 
console.log("");
console.log("======================================");
console.log(" SUPERADMIN CREADO CORRECTAMENTE");
console.log("======================================");
console.log(`ID: ${result.insertId}`);
console.log(`Email: ${email}`);
console.log("Tenant: NULL");
console.log("Rol: SUPERADMIN");
console.log("======================================");
console.log("");
} catch (error) {
console.error("Error creando SUPERADMIN:");
console.error(error.message);
} finally {
await pool.end();
}
}
 
createSuperAdmin();