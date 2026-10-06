const pool = require("../config/database");
 
// ======================================
// OBTENER CITAS DEL BARBERO POR FECHA
// ======================================
 
async function findByBarberAndDate(
tenantId,
barberId,
fecha
) {
const [rows] = await pool.execute(
`
SELECT
id,
tenant_id,
branch_id,
barber_id,
service_id,
cliente_nombre,
cliente_telefono,
cliente_email,
fecha,
hora_inicio,
hora_fin,
precio,
estado,
notas,
created_at,
updated_at
FROM appointments
WHERE tenant_id = ?
AND barber_id = ?
AND fecha = ?
ORDER BY hora_inicio ASC
`,
[
tenantId,
barberId,
fecha
]
);
 
return rows;
}
 
// ======================================
// BUSCAR CITA POR ID Y TENANT
// ======================================
 
async function findByIdAndTenantId(
appointmentId,
tenantId
) {
const [rows] = await pool.execute(
`
SELECT
id,
tenant_id,
branch_id,
barber_id,
service_id,
cliente_nombre,
cliente_telefono,
cliente_email,
fecha,
hora_inicio,
hora_fin,
precio,
estado,
notas,
created_at,
updated_at
FROM appointments
WHERE id = ?
AND tenant_id = ?
LIMIT 1
`,
[
appointmentId,
tenantId
]
);
 
return rows[0] || null;
}
 
// ======================================
// DETECTAR CONFLICTO DE HORARIO
// ======================================
 
async function findConflict(
tenantId,
barberId,
fecha,
horaInicio,
horaFin
) {
const [rows] = await pool.execute(
`
SELECT
id,
hora_inicio,
hora_fin,
estado
FROM appointments
WHERE tenant_id = ?
AND barber_id = ?
AND fecha = ?
AND estado IN ('PENDIENTE', 'CONFIRMADA')
AND hora_inicio < ?
AND hora_fin > ?
LIMIT 1
`,
[
tenantId,
barberId,
fecha,
horaFin,
horaInicio
]
);
 
return rows[0] || null;
}
 
// ======================================
// CREAR RESERVA
// ======================================
 
async function create(appointmentData) {
const {
tenant_id,
branch_id,
barber_id,
service_id,
cliente_nombre,
cliente_telefono,
cliente_email,
fecha,
hora_inicio,
hora_fin,
precio,
notas
} = appointmentData;
 
const [result] = await pool.execute(
`
INSERT INTO appointments (
tenant_id,
branch_id,
barber_id,
service_id,
cliente_nombre,
cliente_telefono,
cliente_email,
fecha,
hora_inicio,
hora_fin,
precio,
notas
)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`,
[
tenant_id,
branch_id,
barber_id,
service_id,
cliente_nombre,
cliente_telefono,
cliente_email || null,
fecha,
hora_inicio,
hora_fin,
precio,
notas || null
]
);
 
return result.insertId;
}
 
// ======================================
// CAMBIAR ESTADO DE LA CITA
// ======================================
 
async function updateStatus(
appointmentId,
tenantId,
estado
) {
const [result] = await pool.execute(
`
UPDATE appointments
SET estado = ?
WHERE id = ?
AND tenant_id = ?
`,
[
estado,
appointmentId,
tenantId
]
);
 
return result.affectedRows;
}
 
// ======================================
// EXPORTAR REPOSITORY
// ======================================
 
// ======================================
// CREAR RESERVA CON PROTECCION CONCURRENTE
// ======================================
 
async function createWithLock(appointmentData) {
const connection = await pool.getConnection();
 
const {
tenant_id,
branch_id,
barber_id,
service_id,
cliente_nombre,
cliente_telefono,
cliente_email,
fecha,
hora_inicio,
hora_fin,
precio,
notas
} = appointmentData;
 
const lockName =
`appointment:${tenant_id}:${barber_id}:${fecha}`;
 
let lockAcquired = false;
 
try {
// ======================================
// ADQUIRIR LOCK EXCLUSIVO
// ======================================
 
const [lockRows] = await connection.execute(
`
SELECT GET_LOCK(?, 5) AS acquired
`,
[lockName]
);
 
lockAcquired =
Number(lockRows[0].acquired) === 1;
 
if (!lockAcquired) {
return {
error: "LOCK_TIMEOUT"
};
}
 
// ======================================
// COMPROBAR CONFLICTO DENTRO DEL LOCK
// ======================================
 
const [conflicts] = await connection.execute(
`
SELECT id
FROM appointments
WHERE tenant_id = ?
AND barber_id = ?
AND fecha = ?
AND estado IN ('PENDIENTE', 'CONFIRMADA')
AND hora_inicio < ?
AND hora_fin > ?
LIMIT 1
`,
[
tenant_id,
barber_id,
fecha,
hora_fin,
hora_inicio
]
);
 
if (conflicts.length > 0) {
return {
error: "APPOINTMENT_CONFLICT"
};
}
 
// ======================================
// INSERTAR RESERVA
// ======================================
 
const [result] = await connection.execute(
`
INSERT INTO appointments (
tenant_id,
branch_id,
barber_id,
service_id,
cliente_nombre,
cliente_telefono,
cliente_email,
fecha,
hora_inicio,
hora_fin,
precio,
notas
)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`,
[
tenant_id,
branch_id,
barber_id,
service_id,
cliente_nombre,
cliente_telefono,
cliente_email || null,
fecha,
hora_inicio,
hora_fin,
precio,
notas || null
]
);
 
return {
id: result.insertId
};
 
} finally {
if (lockAcquired) {
await connection.execute(
`
SELECT RELEASE_LOCK(?)
`,
[lockName]
);
}
 
connection.release();
}
}

module.exports = {
findByBarberAndDate,
findByIdAndTenantId,
findConflict,
create,
createWithLock,
updateStatus
};