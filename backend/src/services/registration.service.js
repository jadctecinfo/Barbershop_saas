const bcrypt = require("bcrypt");

const pool = require("../config/database");

const registrationRepository = require(
  "../repositories/registration.repository"
);

// ======================================
// NORMALIZAR EMAIL
// ======================================

function normalizeEmail(email) {
  return email
    .trim()
    .toLowerCase();
}

// ======================================
// GENERAR SLUG BASE
// ======================================

function generateSlug(text) {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// ======================================
// GENERAR SLUG UNICO
// ======================================

async function generateUniqueSlug(nombre) {
  const baseSlug = generateSlug(nombre);

  if (!baseSlug) {
    return null;
  }

  let slug = baseSlug;
  let suffix = 2;

  while (
    await registrationRepository.findTenantBySlug(
      slug
    )
  ) {
    slug = `${baseSlug}-${suffix}`;
    suffix += 1;
  }

  return slug;
}

// ======================================
// OBTENER ROL ADMIN_BARBERIA
// ======================================

async function findAdminRole() {
  const [rows] = await pool.execute(
    `
      SELECT
        id,
        nombre
      FROM roles
      WHERE nombre = 'ADMIN_BARBERIA'
      LIMIT 1
    `
  );

  return rows[0] || null;
}

// ======================================
// REGISTRAR NUEVA BARBERIA
// ======================================

async function registerBarbershop(
  registrationData
) {
  const {
    barbershop,
    admin
  } = registrationData;

  // ======================================
  // VALIDAR ESTRUCTURA
  // ======================================

  if (!barbershop || !admin) {
    return {
      error: "INVALID_REGISTRATION_DATA"
    };
  }

  // ======================================
  // NORMALIZAR DATOS
  // ======================================

  const barbershopName =
    typeof barbershop.nombre === "string"
      ? barbershop.nombre.trim()
      : "";

  const nit =
    typeof barbershop.nit === "string"
      ? barbershop.nit.trim()
      : "";

  const barbershopPhone =
    typeof barbershop.telefono === "string"
      ? barbershop.telefono.trim()
      : "";

  const whatsapp =
    typeof barbershop.whatsapp === "string" &&
    barbershop.whatsapp.trim()
      ? barbershop.whatsapp.trim()
      : null;

  const adminName =
    typeof admin.nombre === "string"
      ? admin.nombre.trim()
      : "";

  const adminLastName =
    typeof admin.apellido === "string"
      ? admin.apellido.trim()
      : "";

  const adminEmail =
    typeof admin.email === "string"
      ? normalizeEmail(admin.email)
      : "";

  const adminPhone =
    typeof admin.telefono === "string" &&
    admin.telefono.trim()
      ? admin.telefono.trim()
      : null;

  const password =
    typeof admin.password === "string"
      ? admin.password
      : "";

  // ======================================
  // VALIDAR CAMPOS OBLIGATORIOS
  // ======================================

  if (
    !barbershopName ||
    !nit ||
    !barbershopPhone
  ) {
    return {
      error: "BARBERSHOP_DATA_REQUIRED"
    };
  }

  if (
    !adminName ||
    !adminLastName ||
    !adminEmail ||
    !password
  ) {
    return {
      error: "ADMIN_DATA_REQUIRED"
    };
  }

  // ======================================
  // VALIDAR EMAIL BASICO
  // ======================================

  const emailRegex =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(adminEmail)) {
    return {
      error: "INVALID_EMAIL"
    };
  }

  // ======================================
  // VALIDAR LONGITUD PASSWORD
  // ======================================

  if (password.length < 8) {
    return {
      error: "WEAK_PASSWORD"
    };
  }

  // ======================================
  // VALIDAR EMAIL DUPLICADO
  // ======================================

  const existingUser =
    await registrationRepository.findUserByEmail(
      adminEmail
    );

  if (existingUser) {
    return {
      error: "EMAIL_ALREADY_EXISTS"
    };
  }

  // ======================================
  // VALIDAR NIT DUPLICADO
  // ======================================

  const existingTenant =
    await registrationRepository.findTenantByNit(
      nit
    );

  if (existingTenant) {
    return {
      error: "NIT_ALREADY_EXISTS"
    };
  }

  // ======================================
  // OBTENER ROL ADMIN_BARBERIA
  // ======================================

  const adminRole =
    await findAdminRole();

  if (!adminRole) {
    return {
      error: "ADMIN_ROLE_NOT_FOUND"
    };
  }

  // ======================================
  // GENERAR SLUG UNICO
  // ======================================

  const slugUrl =
    await generateUniqueSlug(
      barbershopName
    );

  if (!slugUrl) {
    return {
      error: "INVALID_SLUG"
    };
  }

  // ======================================
  // GENERAR PASSWORD HASH
  // ======================================

  const passwordHash =
    await bcrypt.hash(
      password,
      10
    );

  // ======================================
  // REGISTRO TRANSACCIONAL
  // ======================================

  const result =
    await registrationRepository.registerBarbershop(
      {
        barbershop: {
          nombre: barbershopName,
          nit,
          telefono: barbershopPhone,
          whatsapp
        },

        admin: {
          role_id: adminRole.id,
          nombre: adminName,
          apellido: adminLastName,
          email: adminEmail,
          telefono: adminPhone,
          password_hash: passwordHash
        },

        slug_url: slugUrl
      }
    );

  // ======================================
  // RESPUESTA
  // ======================================

  return {
    tenant_id: result.tenant_id,
    admin_id: result.admin_id,
    slug_url: result.slug_url,
    nombre: barbershopName,
    admin_email: adminEmail
  };
}

// ======================================
// EXPORTAR SERVICE
// ======================================

module.exports = {
  registerBarbershop
};