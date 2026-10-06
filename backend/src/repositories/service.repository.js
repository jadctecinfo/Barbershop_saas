const pool = require("../config/database");
 
// ======================================
// OBTENER SERVICIOS POR TENANT
// ======================================
 
async function findByTenantId(tenantId) {
const [rows] = await pool.execute(
`
SELECT
id,
tenant_id,
nombre,
descripcion,
duracion_minutos,
precio,
estado,
created_at,
updated_at
FROM services
WHERE tenant_id = ?
ORDER BY nombre ASC
`,
[tenantId]
);
 
return rows;
}
 
// ======================================
// OBTENER SERVICIO POR ID Y TENANT
// ======================================
 
async function findByIdAndTenantId(serviceId, tenantId) {
const [rows] = await pool.execute(
`
SELECT
id,
tenant_id,
nombre,
descripcion,
duracion_minutos,
precio,
estado,
created_at,
updated_at
FROM services
WHERE id = ?
AND tenant_id = ?
LIMIT 1
`,
[serviceId, tenantId]
);
 
return rows[0] || null;
}
 
// ======================================
// CREAR SERVICIO
// ======================================
 
async function create(tenantId, serviceData) {
const {
nombre,
descripcion,
duracion_minutos,
precio
} = serviceData;
 
const [result] = await pool.execute(
`
INSERT INTO services (
tenant_id,
nombre,
descripcion,
duracion_minutos,
precio
)
VALUES (?, ?, ?, ?, ?)
`,
[
tenantId,
nombre,
descripcion || null,
duracion_minutos,
precio
]
);
 
return result.insertId;
}
 
// ======================================
// ACTUALIZAR SERVICIO
// ======================================
 
async function update(serviceId, tenantId, serviceData) {
const {
nombre,
descripcion,
duracion_minutos,
precio
} = serviceData;
 
const [result] = await pool.execute(
`
UPDATE services
SET
nombre = ?,
descripcion = ?,
duracion_minutos = ?,
precio = ?
WHERE id = ?
AND tenant_id = ?
`,
[
nombre,
descripcion || null,
duracion_minutos,
precio,
serviceId,
tenantId
]
);
 
return result.affectedRows;
}
 
// ======================================
// CAMBIAR ESTADO
// ======================================
 
async function updateStatus(serviceId, tenantId, estado) {
const [result] = await pool.execute(
`
UPDATE services
SET estado = ?
WHERE id = ?
AND tenant_id = ?
`,
[
estado,
serviceId,
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