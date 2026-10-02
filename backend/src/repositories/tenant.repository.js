// ==============================
// REPOSITORY = HABLAR CON MYSQL
// ==============================

const pool = require("../config/database");
 
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
 
module.exports = {
findAll
};