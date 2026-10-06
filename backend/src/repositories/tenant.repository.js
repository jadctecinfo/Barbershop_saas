// ==============================
// REPOSITORY = HABLAR CON MYSQL
// ==============================
 
const pool = require("../config/database");
 
 
// ==============================
// OBTENER TODOS LOS TENANTS
// ==============================
 
async function findAll() {
const [rows] = await pool.query(`
SELECT
id,
nombre,
nit,
telefono,
slug_url,
logo_url,
descripcion,
instagram_url,
facebook_url,
tiktok_url,
whatsapp,
estado,
created_at,
updated_at
FROM tenants
ORDER BY id ASC
`);
 
return rows;
}
 
 
// ==============================
// OBTENER TENANT POR ID
// ==============================
 
async function findById(id) {
const [rows] = await pool.execute(
`
SELECT
id,
nombre,
nit,
telefono,
slug_url,
logo_url,
descripcion,
instagram_url,
facebook_url,
tiktok_url,
whatsapp,
estado,
created_at,
updated_at
FROM tenants
WHERE id = ?
LIMIT 1
`,
[id]
);
 
return rows[0] || null;
}
 
 
// ==============================
// EXPORTAR REPOSITORY
// ==============================
 
// ======================================
// BUSCAR TENANT POR SLUG
// ======================================
 
async function findBySlug(slug) {
const [rows] = await pool.execute(
`
SELECT
id,
nombre,
nit,
telefono,
slug_url,
estado,
created_at,
updated_at
FROM tenants
WHERE slug_url = ?
LIMIT 1
`,
[slug]
);
 
return rows[0] || null;
}

module.exports = {
findAll,
findById,
findBySlug
};