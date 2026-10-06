require("dotenv").config();
 
const bcrypt = require("bcrypt");
const pool = require("../config/database");
 
async function verifyPassword() {
try {
const email =
"admin@barberiacentral.local";
 
const password =
"AdminBarberCentral2026";
 
const [rows] = await pool.execute(
`
SELECT
id,
tenant_id,
email,
password_hash,
estado
FROM users
WHERE email = ?
LIMIT 1
`,
[email]
);
 
if (rows.length === 0) {
console.log("Usuario no encontrado.");
return;
}
 
const user = rows[0];
 
const matches =
await bcrypt.compare(
password,
user.password_hash
);
 
console.log("");
console.log("======================================");
console.log(" VERIFICACION PASSWORD ADMIN");
console.log("======================================");
console.log(`Usuario ID: ${user.id}`);
console.log(`Tenant ID: ${user.tenant_id}`);
console.log(`Estado: ${user.estado}`);
console.log(`Password coincide: ${matches}`);
console.log("======================================");
console.log("");
 
} catch (error) {
console.error(
"Error verificando password:",
error.message
);
} finally {
await pool.end();
}
}
 
verifyPassword();