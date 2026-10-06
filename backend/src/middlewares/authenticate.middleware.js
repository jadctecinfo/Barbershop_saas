const jwt = require("jsonwebtoken");
 
// ======================================
// AUTENTICAR USUARIO MEDIANTE JWT
// ======================================
 
function authenticate(req, res, next) {
try {
const authorizationHeader = req.headers.authorization;
 
if (!authorizationHeader) {
return res.status(401).json({
ok: false,
message: "Token de autenticación requerido"
});
}
 
const [type, token] = authorizationHeader.split(" ");
 
if (type !== "Bearer" || !token) {
return res.status(401).json({
ok: false,
message: "Formato de token inválido"
});
}
 
const decoded = jwt.verify(
token,
process.env.JWT_SECRET
);
 
req.user = decoded;
 
next();
 
} catch (error) {
return res.status(401).json({
ok: false,
message: "Token inválido o expirado"
});
}
}
 
module.exports = authenticate;