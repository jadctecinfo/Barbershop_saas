const API_URL = import.meta.env.VITE_API_URL;

// ======================================
// VALIDAR CONFIGURACION
// ======================================

if (!API_URL) {
throw new Error(
"VITE_API_URL no está configurada en el archivo .env"
);
}

// ======================================
// OBTENER TOKEN
// ======================================

function getToken() {
return localStorage.getItem("barbershop_token");
}

// ======================================
// CONSTRUIR URL
// ======================================

function buildUrl(endpoint) {
if (!endpoint.startsWith("/")) {
endpoint = `/${endpoint}`;
}

return `${API_URL}${endpoint}`;
}

// ======================================
// EXTRAER RESPUESTA JSON
// ======================================

async function parseResponse(response) {
const contentType =
response.headers.get("content-type");

if (
contentType &&
contentType.includes("application/json")
) {
return response.json();
}

return null;
}

// ======================================
// REQUEST GENERAL
// ======================================

async function request(
endpoint,
options = {}
) {
const {
method = "GET",
body = undefined,
authenticated = false,
headers: customHeaders = {}
} = options;

const headers = {
Accept: "application/json",
...customHeaders
};

// ======================================
// BODY JSON
// ======================================

if (body !== undefined) {
headers["Content-Type"] =
"application/json";
}

// ======================================
// AUTENTICACION
// ======================================

if (authenticated) {
const token = getToken();

if (!token) {
const authError =
new Error("Sesión no disponible");

authError.status = 401;
 
throw authError;
}

headers.Authorization =
`Bearer ${token}`;
}

// ======================================
// EJECUTAR PETICION
// ======================================

let response;

try {
response = await fetch(
buildUrl(endpoint),
{
method,
headers,
body:
body !== undefined
? JSON.stringify(body)
: undefined
}
);
} catch {
const networkError =
new Error(
"No fue posible conectar con el servidor"
);

networkError.status = 0;

throw networkError;
}

// ======================================
// PROCESAR RESPUESTA
// ======================================

const data =
await parseResponse(response);

// ======================================
// MANEJAR ERROR HTTP
// ======================================

if (!response.ok) {
const requestError =
new Error(
data?.message ||
`Error HTTP ${response.status}`
);

requestError.status =
response.status;

requestError.data =
data;

throw requestError;
}

return data;
}

// ======================================
// GET
// ======================================

function get(
endpoint,
authenticated = false
) {
return request(
endpoint,
{
method: "GET",
authenticated
}
);
}

// ======================================
// POST
// ======================================

function post(
endpoint,
body,
authenticated = false
) {
return request(
endpoint,
{
method: "POST",
body,
authenticated
}
);
}

// ======================================
// PUT
// ======================================

function put(
endpoint,
body,
authenticated = true
) {
return request(
endpoint,
{
method: "PUT",
body,
authenticated
}
);
}

// ======================================
// PATCH
// ======================================

function patch(
endpoint,
body,
authenticated = true
) {
return request(
endpoint,
{
method: "PATCH",
body,
authenticated
}
);
}

// ======================================
// DELETE
// ======================================

function remove(
endpoint,
authenticated = true
) {
return request(
endpoint,
{
method: "DELETE",
authenticated
}
);
}

// ======================================
// EXPORTAR CLIENTE API
// ======================================

const apiClient = {
get,
post,
put,
patch,
delete: remove
};

export default apiClient;