const pool = require("../config/database");
 
// ======================================
// OBTENER SUCURSALES POR TENANT
// ======================================
 
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
 
// ======================================
// CREAR SUCURSAL
// ======================================
 
async function create(tenantId, branchData) {
const {
nombre,
direccion,
ciudad,
telefono,
google_maps_url
} = branchData;
 
const [result] = await pool.execute(
`
INSERT INTO branches (
tenant_id,
nombre,
direccion,
ciudad,
telefono,
google_maps_url
)
VALUES (?, ?, ?, ?, ?, ?)
`,
[
tenantId,
nombre,
direccion,
ciudad,
telefono || null,
google_maps_url || null
]
);
 
return result.insertId;
}
 
async function findByIdAndTenantId(branchId, tenantId) {
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
WHERE id = ?
AND tenant_id = ?
LIMIT 1
`,
[branchId, tenantId]
);
 
return rows[0] || null;
}
 
// ======================================
// ACTUALIZAR SUCURSAL
// ======================================
 
async function update(branchId, tenantId, branchData) {
const {
nombre,
direccion,
ciudad,
telefono,
google_maps_url
} = branchData;
 
const [result] = await pool.execute(
`
UPDATE branches
SET
nombre = ?,
direccion = ?,
ciudad = ?,
telefono = ?,
google_maps_url = ?
WHERE id = ?
AND tenant_id = ?
`,
[
nombre,
direccion,
ciudad,
telefono || null,
google_maps_url || null,
branchId,
tenantId
]
);
 
return result.affectedRows;
}

// ======================================
// CAMBIAR ESTADO DE SUCURSAL
// ======================================
 
async function updateStatus(branchId, tenantId, estado) {
const [result] = await pool.execute(
`
UPDATE branches
SET estado = ?
WHERE id = ?
AND tenant_id = ?
`,
[
estado,
branchId,
tenantId
]
);
 
return result.affectedRows;
}

// ======================================
// EXPORTAR REPOSITORY
// ======================================

module.exports = {
findByTenantId,
findByIdAndTenantId,
create,
update,
updateStatus
};