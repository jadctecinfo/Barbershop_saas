const pool = require("../config/database");
 
// ======================================
// OBTENER HORARIOS POR BARBERO Y TENANT
// ======================================
 
async function findByBarberAndTenantId(
barberId,
tenantId
) {
const [rows] = await pool.execute(
`
SELECT
bs.id,
bs.tenant_id,
bs.barber_id,
bs.dia_semana,
bs.hora_inicio,
bs.hora_fin,
bs.estado,
bs.created_at,
bs.updated_at
FROM barber_schedules bs
INNER JOIN barbers b
ON b.id = bs.barber_id
WHERE bs.barber_id = ?
AND bs.tenant_id = ?
AND b.tenant_id = ?
ORDER BY FIELD(
bs.dia_semana,
'LUNES',
'MARTES',
'MIERCOLES',
'JUEVES',
'VIERNES',
'SABADO',
'DOMINGO'
)
`,
[
barberId,
tenantId,
tenantId
]
);
 
return rows;
}
 
// ======================================
// OBTENER HORARIO ESPECÍFICO
// ======================================
 
async function findByIdAndTenantId(
scheduleId,
tenantId
) {
const [rows] = await pool.execute(
`
SELECT
id,
tenant_id,
barber_id,
dia_semana,
hora_inicio,
hora_fin,
estado,
created_at,
updated_at
FROM barber_schedules
WHERE id = ?
AND tenant_id = ?
LIMIT 1
`,
[
scheduleId,
tenantId
]
);
 
return rows[0] || null;
}
 
// ======================================
// ACTUALIZAR HORARIO
// ======================================
 
async function update(
scheduleId,
tenantId,
scheduleData
) {
const {
hora_inicio,
hora_fin
} = scheduleData;
 
const [result] = await pool.execute(
`
UPDATE barber_schedules
SET
hora_inicio = ?,
hora_fin = ?
WHERE id = ?
AND tenant_id = ?
`,
[
hora_inicio,
hora_fin,
scheduleId,
tenantId
]
);
 
return result.affectedRows;
}
 
// ======================================
// CAMBIAR ESTADO DEL HORARIO
// ======================================
 
async function updateStatus(
scheduleId,
tenantId,
estado
) {
const [result] = await pool.execute(
`
UPDATE barber_schedules
SET estado = ?
WHERE id = ?
AND tenant_id = ?
`,
[
estado,
scheduleId,
tenantId
]
);
 
return result.affectedRows;
}
 
// ======================================
// EXPORTAR REPOSITORY
// ======================================
 
module.exports = {
findByBarberAndTenantId,
findByIdAndTenantId,
update,
updateStatus
};