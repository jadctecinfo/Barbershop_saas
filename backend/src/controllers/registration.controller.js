const registrationService = require(
  "../services/registration.service"
);

// ======================================
// REGISTRAR NUEVA BARBERIA
// ======================================

async function registerBarbershop(req, res) {
  try {
    const {
      barbershop,
      admin
    } = req.body;

    const result =
      await registrationService.registerBarbershop(
        {
          barbershop,
          admin
        }
      );

    // ======================================
    // ERRORES DE VALIDACION
    // ======================================

    const errors = {
      INVALID_REGISTRATION_DATA: [
        400,
        "Los datos de registro son obligatorios"
      ],

      BARBERSHOP_DATA_REQUIRED: [
        400,
        "Nombre, NIT y teléfono de la barbería son obligatorios"
      ],

      ADMIN_DATA_REQUIRED: [
        400,
        "Los datos del administrador son obligatorios"
      ],

      INVALID_EMAIL: [
        400,
        "El correo electrónico no es válido"
      ],

      WEAK_PASSWORD: [
        400,
        "La contraseña debe tener al menos 8 caracteres"
      ],

      EMAIL_ALREADY_EXISTS: [
        409,
        "Ya existe un usuario registrado con este correo electrónico"
      ],

      NIT_ALREADY_EXISTS: [
        409,
        "Ya existe una barbería registrada con este NIT"
      ],

      ADMIN_ROLE_NOT_FOUND: [
        500,
        "No fue posible configurar el administrador de la barbería"
      ],

      INVALID_SLUG: [
        400,
        "No fue posible generar una URL válida para la barbería"
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
    // REGISTRO EXITOSO
    // ======================================

    return res.status(201).json({
      ok: true,
      message:
        "Barbería registrada correctamente",
      data: {
        tenant_id: result.tenant_id,
        admin_id: result.admin_id,
        nombre: result.nombre,
        slug_url: result.slug_url,
        admin_email: result.admin_email
      }
    });

  } catch (error) {
    console.error(
      "Error registrando barbería:",
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
  registerBarbershop
};