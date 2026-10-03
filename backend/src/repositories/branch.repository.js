const pool = require("../config/database");
 
async function findByTenantId(tenantId) {
const [rows] = await pool.execute(
`
SELECT
id,
tenant_id,
nombre,
direccion,
ciudad,
telefono,
google_maps_url,
estado,
created_at,
updated_at
FROM branches
WHERE tenant_id = ?
ORDER BY id ASC
`,
[tenantId]
);
 
return rows;
}
 
module.exports = {
findByTenantId,
create
};