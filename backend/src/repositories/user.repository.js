const pool = require("../config/database");
 
// ======================================
// BUSCAR USUARIO POR EMAIL
// ======================================
 
async function findByEmail(email) {
const [rows] = await pool.execute(
`
SELECT
u.id,
u.tenant_id,
u.role_id,
u.nombre,
u.apellido,
u.email,
u.telefono,
u.password_hash,
u.estado,
u.created_at,
u.updated_at,
r.nombre AS rol,
t.nombre AS tenant_nombre,
t.estado AS tenant_estado
FROM users u
INNER JOIN roles r
ON r.id = u.role_id
LEFT JOIN tenants t
ON t.id = u.tenant_id
WHERE u.email = ?
LIMIT 1
`,
[email]
);
 
return rows[0] || null;
}
 
// ======================================
// BUSCAR USUARIO POR ID
// ======================================
 
async function findById(id) {
const [rows] = await pool.execute(
`
SELECT
u.id,
u.tenant_id,
u.role_id,
u.nombre,
u.apellido,
u.email,
u.telefono,
u.estado,
r.nombre AS rol,
t.nombre AS tenant_nombre,
t.estado AS tenant_estado
FROM users u
INNER JOIN roles r
ON r.id = u.role_id
LEFT JOIN tenants t
ON t.id = u.tenant_id
WHERE u.id = ?
LIMIT 1
`,
[id]
);
 
return rows[0] || null;
}
 
// ======================================
// EXPORTAR REPOSITORY
// ======================================
 
module.exports = {
findByEmail,
findById
};