const pool = require("../config/database");
 
// ======================================
// BUSCAR EMAIL EXISTENTE
// ======================================
 
async function findUserByEmail(email) {
const [rows] = await pool.execute(
`
SELECT id
FROM users
WHERE email = ?
LIMIT 1
`,
[email]
);
 
return rows[0] || null;
}
 
// ======================================
// BUSCAR SLUG EXISTENTE
// ======================================
 
async function findTenantBySlug(slug) {
const [rows] = await pool.execute(
`
SELECT id
FROM tenants
WHERE slug_url = ?
LIMIT 1
`,
[slug]
);
 
return rows[0] || null;
}
 
// ======================================
// BUSCAR NIT EXISTENTE
// ======================================
 
async function findTenantByNit(nit) {
const [rows] = await pool.execute(
`
SELECT id
FROM tenants
WHERE nit = ?
LIMIT 1
`,
[nit]
);
 
return rows[0] || null;
}
 
// ======================================
// REGISTRAR BARBERIA + ADMIN
// TRANSACCIONAL
// ======================================
 
async function registerBarbershop(data) {
const connection =
await pool.getConnection();
 
try {
await connection.beginTransaction();
 
// ======================================
// CREAR TENANT
// ======================================
 
const [tenantResult] =
await connection.execute(
`
INSERT INTO tenants (
nombre,
nit,
telefono,
slug_url,
whatsapp
)
VALUES (?, ?, ?, ?, ?)
`,
[
data.barbershop.nombre,
data.barbershop.nit,
data.barbershop.telefono,
data.slug_url,
data.barbershop.whatsapp || null
]
);
 
const tenantId =
tenantResult.insertId;
 
// ======================================
// CREAR ADMIN_BARBERIA
// ======================================
 
const [userResult] =
await connection.execute(
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
data.admin.role_id,
data.admin.nombre,
data.admin.apellido,
data.admin.email,
data.admin.telefono || null,
data.admin.password_hash
]
);
 
await connection.commit();
 
return {
tenant_id: tenantId,
admin_id: userResult.insertId,
slug_url: data.slug_url
};
 
} catch (error) {
await connection.rollback();
 
throw error;
 
} finally {
connection.release();
}
}
 
// ======================================
// EXPORTAR REPOSITORY
// ======================================
 
module.exports = {
findUserByEmail,
findTenantBySlug,
findTenantByNit,
registerBarbershop
};