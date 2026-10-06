const pool = require("../config/database");
 
const tenantRepository = require(
"../repositories/tenant.repository"
);
 
const availabilityService = require(
"./availability.service"
);
 
const appointmentService = require(
"./appointment.service"
);
 
// ======================================
// OBTENER Y VALIDAR TENANT PUBLICO
// ======================================
 
async function resolvePublicTenant(slug) {
const tenant =
await tenantRepository.findBySlug(slug);
 
if (!tenant) {
return {
error: "TENANT_NOT_FOUND"
};
}
 
if (tenant.estado !== "ACTIVO") {
return {
error: "TENANT_INACTIVE"
};
}
 
return {
tenant
};
}
 
// ======================================
// OBTENER TENANT PUBLICO POR SLUG
// ======================================
 
async function getPublicTenant(slug) {
const result =
await resolvePublicTenant(slug);
 
if (result.error) {
return result;
}
 
const { tenant } = result;
 
return {
id: tenant.id,
nombre: tenant.nombre,
telefono: tenant.telefono,
slug_url: tenant.slug_url
};
}
 
// ======================================
// OBTENER SUCURSALES PUBLICAS
// ======================================
 
async function getPublicBranches(slug) {
const result =
await resolvePublicTenant(slug);
 
if (result.error) {
return result;
}
 
const { tenant } = result;
 
const [branches] = await pool.execute(
`
SELECT
id,
nombre,
direccion,
ciudad,
telefono,
google_maps_url
FROM branches
WHERE tenant_id = ?
AND estado = 'ACTIVO'
ORDER BY nombre ASC
`,
[tenant.id]
);
 
return {
tenant: {
id: tenant.id,
nombre: tenant.nombre,
slug_url: tenant.slug_url
},
branches
};
}
 
// ======================================
// OBTENER SERVICIOS PUBLICOS
// ======================================
 
async function getPublicServices(slug) {
const result =
await resolvePublicTenant(slug);
 
if (result.error) {
return result;
}
 
const { tenant } = result;
 
const [services] = await pool.execute(
`
SELECT
id,
nombre,
descripcion,
duracion_minutos,
precio
FROM services
WHERE tenant_id = ?
AND estado = 'ACTIVO'
ORDER BY nombre ASC
`,
[tenant.id]
);
 
return {
tenant: {
id: tenant.id,
nombre: tenant.nombre,
slug_url: tenant.slug_url
},
services
};
}
 
// ======================================
// OBTENER BARBEROS PUBLICOS
// ======================================
 
async function getPublicBarbers(
slug,
branchId,
serviceId
) {
const result =
await resolvePublicTenant(slug);
 
if (result.error) {
return result;
}
 
const { tenant } = result;
 
const [barbers] = await pool.execute(
`
SELECT DISTINCT
b.id,
b.branch_id,
b.nombre_profesional,
b.especialidad,
b.foto_url
FROM barbers b
INNER JOIN branches br
ON br.id = b.branch_id
INNER JOIN barber_services bs
ON bs.barber_id = b.id
INNER JOIN services s
ON s.id = bs.service_id
WHERE b.tenant_id = ?
AND b.branch_id = ?
AND bs.service_id = ?
AND s.tenant_id = ?
AND b.estado = 'ACTIVO'
AND br.estado = 'ACTIVO'
AND s.estado = 'ACTIVO'
ORDER BY b.nombre_profesional ASC
`,
[
tenant.id,
branchId,
serviceId,
tenant.id
]
);
 
return {
tenant: {
id: tenant.id,
nombre: tenant.nombre,
slug_url: tenant.slug_url
},
barbers
};
}
 
// ======================================
// OBTENER DISPONIBILIDAD PUBLICA
// ======================================
 
async function getPublicAvailability(
slug,
branchId,
barberId,
serviceId,
fecha
) {
const result =
await resolvePublicTenant(slug);
 
if (result.error) {
return result;
}
 
const { tenant } = result;
 
// Validar sucursal
const [branches] = await pool.execute(
`
SELECT id
FROM branches
WHERE id = ?
AND tenant_id = ?
AND estado = 'ACTIVO'
LIMIT 1
`,
[
branchId,
tenant.id
]
);
 
if (branches.length === 0) {
return {
error: "BRANCH_NOT_FOUND"
};
}
 
// Validar barbero
const [barbers] = await pool.execute(
`
SELECT id
FROM barbers
WHERE id = ?
AND tenant_id = ?
AND branch_id = ?
AND estado = 'ACTIVO'
LIMIT 1
`,
[
barberId,
tenant.id,
branchId
]
);
 
if (barbers.length === 0) {
return {
error: "BARBER_NOT_FOUND"
};
}
 
// Validar servicio y relación barber-service
const [relations] = await pool.execute(
`
SELECT 1
FROM barber_services bs
INNER JOIN services s
ON s.id = bs.service_id
WHERE bs.barber_id = ?
AND bs.service_id = ?
AND s.tenant_id = ?
AND s.estado = 'ACTIVO'
LIMIT 1
`,
[
barberId,
serviceId,
tenant.id
]
);
 
if (relations.length === 0) {
return {
error: "BARBER_SERVICE_NOT_ALLOWED"
};
}
 
return availabilityService.getAvailability(
tenant.id,
barberId,
serviceId,
fecha
);
}
 
// ======================================
// CREAR RESERVA PUBLICA
// ======================================
 
async function createPublicAppointment(
slug,
appointmentData
) {
const result =
await resolvePublicTenant(slug);
 
if (result.error) {
return result;
}
 
const { tenant } = result;
 
return appointmentService.createAppointment(
tenant.id,
appointmentData
);
}
 
// ======================================
// EXPORTAR SERVICE
// ======================================
 
module.exports = {
getPublicTenant,
getPublicBranches,
getPublicServices,
getPublicBarbers,
getPublicAvailability,
createPublicAppointment
};