const pool = require("../config/database");
 
// ======================================
// OBTENER BARBEROS POR TENANT
// ======================================
 
async function findByTenantId(tenantId) {
const sql = `
SELECT
b.id,
b.tenant_id,
b.branch_id,
b.user_id,
b.nombre_profesional,
b.especialidad,
b.foto_url,
b.estado,
b.created_at,
b.updated_at,
br.nombre AS branch_nombre,
u.nombre AS usuario_nombre,
u.apellido AS usuario_apellido,
u.email AS usuario_email,
u.telefono AS usuario_telefono
FROM barbers AS b
INNER JOIN branches AS br
ON br.id = b.branch_id
INNER JOIN users AS u
ON u.id = b.user_id
WHERE b.tenant_id = ?
ORDER BY b.nombre_profesional ASC
`;
 
const [rows] = await pool.execute(sql, [tenantId]);
 
return rows;
}
 
// ======================================
// OBTENER BARBERO POR ID Y TENANT
// ======================================
 
async function findByIdAndTenantId(barberId, tenantId) {
const sql = `
SELECT
b.id,
b.tenant_id,
b.branch_id,
b.user_id,
b.nombre_profesional,
b.especialidad,
b.foto_url,
b.estado,
b.created_at,
b.updated_at,
br.nombre AS branch_nombre,
u.nombre AS usuario_nombre,
u.apellido AS usuario_apellido,
u.email AS usuario_email,
u.telefono AS usuario_telefono
FROM barbers AS b
INNER JOIN branches AS br
ON br.id = b.branch_id
INNER JOIN users AS u
ON u.id = b.user_id
WHERE b.id = ?
AND b.tenant_id = ?
LIMIT 1
`;
 
const [rows] = await pool.execute(
sql,
[barberId, tenantId]
);
 
return rows[0] || null;
}
 
// ======================================
// CREAR PERFIL DE BARBERO
// ======================================
 
async function create(tenantId, barberData) {
const {
branch_id,
user_id,
nombre_profesional,
especialidad,
foto_url
} = barberData;
 
const sql = `
INSERT INTO barbers (
tenant_id,
branch_id,
user_id,
nombre_profesional,
especialidad,
foto_url
)
VALUES (?, ?, ?, ?, ?, ?)
`;
 
const [result] = await pool.execute(
sql,
[
tenantId,
branch_id,
user_id,
nombre_profesional,
especialidad || null,
foto_url || null
]
);
 
return result.insertId;
}
 
// ======================================
// ACTUALIZAR PERFIL DEL BARBERO
// ======================================
 
async function update(barberId, tenantId, barberData) {
const {
branch_id,
nombre_profesional,
especialidad,
foto_url
} = barberData;
 
const sql = `
UPDATE barbers
SET
branch_id = ?,
nombre_profesional = ?,
especialidad = ?,
foto_url = ?
WHERE id = ?
AND tenant_id = ?
`;
 
const [result] = await pool.execute(
sql,
[
branch_id,
nombre_profesional,
especialidad || null,
foto_url || null,
barberId,
tenantId
]
);
 
return result.affectedRows;
}
 
// ======================================
// CAMBIAR ESTADO DEL BARBERO
// ======================================
 
async function updateStatus(barberId, tenantId, estado) {
const sql = `
UPDATE barbers
SET estado = ?
WHERE id = ?
AND tenant_id = ?
`;
 
const [result] = await pool.execute(
sql,
[estado, barberId, tenantId]
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