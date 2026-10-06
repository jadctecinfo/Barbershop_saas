const publicService = require(
  "../services/public.service"
);

// ======================================
// MANEJAR ERRORES DEL TENANT
// ======================================

function handleTenantError(result, res) {
  if (result.error === "TENANT_NOT_FOUND") {
    res.status(404).json({
      ok: false,
      message: "Barbería no encontrada"
    });

    return true;
  }

  if (result.error === "TENANT_INACTIVE") {
    res.status(403).json({
      ok: false,
      message: "La barbería no está disponible"
    });

    return true;
  }

  return false;
}

// ======================================
// OBTENER BARBERIA PUBLICA
// ======================================

async function getBarbershop(req, res) {
  try {
    const { slug } = req.params;

    const result =
      await publicService.getPublicTenant(slug);

    if (handleTenantError(result, res)) {
      return;
    }

    return res.status(200).json({
      ok: true,
      data: result
    });

  } catch (error) {
    console.error(
      "Error obteniendo barbería pública:",
      error.message
    );

    return res.status(500).json({
      ok: false,
      message: "Error interno del servidor"
    });
  }
}

// ======================================
// OBTENER SUCURSALES PUBLICAS
// ======================================

async function getBranches(req, res) {
  try {
    const { slug } = req.params;

    const result =
      await publicService.getPublicBranches(slug);

    if (handleTenantError(result, res)) {
      return;
    }

    return res.status(200).json({
      ok: true,
      tenant: result.tenant,
      data: result.branches
    });

  } catch (error) {
    console.error(
      "Error obteniendo sucursales públicas:",
      error.message
    );

    return res.status(500).json({
      ok: false,
      message: "Error interno del servidor"
    });
  }
}

// ======================================
// OBTENER SERVICIOS PUBLICOS
// ======================================

async function getServices(req, res) {
  try {
    const { slug } = req.params;

    const result =
      await publicService.getPublicServices(slug);

    if (handleTenantError(result, res)) {
      return;
    }

    return res.status(200).json({
      ok: true,
      tenant: result.tenant,
      data: result.services
    });

  } catch (error) {
    console.error(
      "Error obteniendo servicios públicos:",
      error.message
    );

    return res.status(500).json({
      ok: false,
      message: "Error interno del servidor"
    });
  }
}

// ======================================
// OBTENER BARBEROS PUBLICOS
// ======================================

async function getBarbers(req, res) {
  try {
    const { slug } = req.params;

    const {
      branch_id,
      service_id
    } = req.query;

    const branchId = Number(branch_id);
    const serviceId = Number(service_id);

    if (
      !Number.isInteger(branchId) ||
      branchId <= 0 ||
      !Number.isInteger(serviceId) ||
      serviceId <= 0
    ) {
      return res.status(400).json({
        ok: false,
        message:
          "Sucursal y servicio son obligatorios"
      });
    }

    const result =
      await publicService.getPublicBarbers(
        slug,
        branchId,
        serviceId
      );

    if (handleTenantError(result, res)) {
      return;
    }

    return res.status(200).json({
      ok: true,
      tenant: result.tenant,
      data: result.barbers
    });

  } catch (error) {
    console.error(
      "Error obteniendo barberos públicos:",
      error.message
    );

    return res.status(500).json({
      ok: false,
      message: "Error interno del servidor"
    });
  }
}

// ======================================
// OBTENER DISPONIBILIDAD PUBLICA
// ======================================

async function getAvailability(req, res) {
  try {
    const { slug } = req.params;

    const {
      branch_id,
      barber_id,
      service_id,
      fecha
    } = req.query;

    const branchId = Number(branch_id);
    const barberId = Number(barber_id);
    const serviceId = Number(service_id);

    if (
      !Number.isInteger(branchId) ||
      branchId <= 0 ||
      !Number.isInteger(barberId) ||
      barberId <= 0 ||
      !Number.isInteger(serviceId) ||
      serviceId <= 0
    ) {
      return res.status(400).json({
        ok: false,
        message:
          "Sucursal, barbero y servicio son obligatorios"
      });
    }

    const dateRegex =
      /^\d{4}-\d{2}-\d{2}$/;

    if (
      typeof fecha !== "string" ||
      !dateRegex.test(fecha)
    ) {
      return res.status(400).json({
        ok: false,
        message:
          "La fecha debe tener formato YYYY-MM-DD"
      });
    }

    const result =
      await publicService.getPublicAvailability(
        slug,
        branchId,
        barberId,
        serviceId,
        fecha
      );

    if (handleTenantError(result, res)) {
      return;
    }

    if (result.error === "BRANCH_NOT_FOUND") {
      return res.status(404).json({
        ok: false,
        message: "Sucursal no encontrada"
      });
    }

    if (result.error === "BARBER_NOT_FOUND") {
      return res.status(404).json({
        ok: false,
        message: "Barbero no encontrado"
      });
    }

    if (
      result.error ===
      "BARBER_SERVICE_NOT_ALLOWED"
    ) {
      return res.status(400).json({
        ok: false,
        message:
          "El barbero no presta el servicio seleccionado"
      });
    }

    if (result.error === "SERVICE_NOT_FOUND") {
      return res.status(404).json({
        ok: false,
        message: "Servicio no encontrado"
      });
    }

    if (result.error === "SERVICE_INACTIVE") {
      return res.status(403).json({
        ok: false,
        message:
          "El servicio no está disponible"
      });
    }

    if (result.error === "BARBER_INACTIVE") {
      return res.status(403).json({
        ok: false,
        message:
          "El barbero no está disponible"
      });
    }

    return res.status(200).json({
      ok: true,
      data: result
    });

  } catch (error) {
    console.error(
      "Error obteniendo disponibilidad pública:",
      error.message
    );

    return res.status(500).json({
      ok: false,
      message: "Error interno del servidor"
    });
  }
}

// ======================================
// CREAR RESERVA PUBLICA
// ======================================

async function createAppointment(req, res) {
  try {
    const { slug } = req.params;

    const {
      branch_id,
      barber_id,
      service_id,
      cliente_nombre,
      cliente_telefono,
      cliente_email,
      fecha,
      hora_inicio,
      notas
    } = req.body;

    // ======================================
    // VALIDAR IDENTIFICADORES
    // ======================================

    if (
      !Number.isInteger(branch_id) ||
      branch_id <= 0 ||
      !Number.isInteger(barber_id) ||
      barber_id <= 0 ||
      !Number.isInteger(service_id) ||
      service_id <= 0
    ) {
      return res.status(400).json({
        ok: false,
        message:
          "Sucursal, barbero y servicio son obligatorios"
      });
    }

    // ======================================
    // VALIDAR CLIENTE
    // ======================================

    if (
      typeof cliente_nombre !== "string" ||
      !cliente_nombre.trim()
    ) {
      return res.status(400).json({
        ok: false,
        message:
          "El nombre del cliente es obligatorio"
      });
    }

    if (
      typeof cliente_telefono !== "string" ||
      !cliente_telefono.trim()
    ) {
      return res.status(400).json({
        ok: false,
        message:
          "El teléfono del cliente es obligatorio"
      });
    }

    // ======================================
    // VALIDAR FECHA
    // ======================================

    const dateRegex =
      /^\d{4}-\d{2}-\d{2}$/;

    if (
      typeof fecha !== "string" ||
      !dateRegex.test(fecha)
    ) {
      return res.status(400).json({
        ok: false,
        message:
          "La fecha debe tener formato YYYY-MM-DD"
      });
    }

    // ======================================
    // VALIDAR HORA
    // ======================================

    const timeRegex =
      /^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/;

    if (
      typeof hora_inicio !== "string" ||
      !timeRegex.test(hora_inicio)
    ) {
      return res.status(400).json({
        ok: false,
        message:
          "La hora debe tener formato HH:MM o HH:MM:SS"
      });
    }

    // ======================================
    // CREAR RESERVA
    // ======================================

    const result =
      await publicService.createPublicAppointment(
        slug,
        {
          branch_id,
          barber_id,
          service_id,

          cliente_nombre:
            cliente_nombre.trim(),

          cliente_telefono:
            cliente_telefono.trim(),

          cliente_email:
            typeof cliente_email === "string" &&
            cliente_email.trim()
              ? cliente_email
                  .trim()
                  .toLowerCase()
              : null,

          fecha,
          hora_inicio,

          notas:
            typeof notas === "string" &&
            notas.trim()
              ? notas.trim()
              : null
        }
      );

    // ======================================
    // ERRORES DE NEGOCIO
    // ======================================

    const errors = {
      TENANT_NOT_FOUND: [
        404,
        "Barbería no encontrada"
      ],

      TENANT_INACTIVE: [
        403,
        "La barbería no está disponible"
      ],

      BRANCH_NOT_FOUND: [
        404,
        "Sucursal no encontrada"
      ],

      BRANCH_INACTIVE: [
        403,
        "La sucursal no está disponible"
      ],

      BARBER_NOT_FOUND: [
        404,
        "Barbero no encontrado"
      ],

      BARBER_INACTIVE: [
        403,
        "El barbero no está disponible"
      ],

      BARBER_BRANCH_MISMATCH: [
        400,
        "El barbero no pertenece a la sucursal"
      ],

      SERVICE_NOT_FOUND: [
        404,
        "Servicio no encontrado"
      ],

      SERVICE_INACTIVE: [
        403,
        "El servicio no está disponible"
      ],

      BARBER_SERVICE_NOT_ALLOWED: [
        400,
        "El barbero no presta el servicio seleccionado"
      ],

      BARBER_NOT_WORKING: [
        409,
        "El barbero no trabaja en la fecha seleccionada"
      ],

      OUTSIDE_WORKING_HOURS: [
        409,
        "La hora está fuera del horario laboral"
      ],

      INVALID_SLOT: [
        409,
        "La hora seleccionada no está disponible"
      ],

      APPOINTMENT_CONFLICT: [
        409,
        "El horario seleccionado ya no está disponible"
      ],

      APPOINTMENT_BUSY: [
        409,
        "El horario está siendo procesado. Intenta nuevamente."
      ]
    };

    if (
      result.error &&
      errors[result.error]
    ) {
      const [status, message] =
        errors[result.error];

      return res.status(status).json({
        ok: false,
        message
      });
    }

    // ======================================
    // RESPUESTA EXITOSA
    // ======================================

    return res.status(201).json({
      ok: true,
      message: "Reserva creada correctamente",
      data: result
    });

  } catch (error) {
    console.error(
      "Error creando reserva pública:",
      error.message
    );

    return res.status(500).json({
      ok: false,
      message: "Error interno del servidor"
    });
  }
}

// ======================================
// EXPORTAR CONTROLLER
// ======================================

module.exports = {
  getBarbershop,
  getBranches,
  getServices,
  getBarbers,
  getAvailability,
  createAppointment
};