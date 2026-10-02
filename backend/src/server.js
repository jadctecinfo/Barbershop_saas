require("dotenv").config();
 
const app = require("./app");

const pool = require("./config/database");

const PORT = process.env.PORT || 3000;

async function testDatabaseConnection() {
try {
const connection = await pool.getConnection();
 
console.log("✅ Conexión con MySQL establecida correctamente");
console.log(`✅ Base de datos: ${process.env.DB_NAME}`);
 
connection.release();
} catch (error) {
console.error("❌ Error al conectar con MySQL:");
console.error(error.message);
}
}
 
testDatabaseConnection();


app.listen(PORT, () => {
console.log("");
console.log("======================================");
console.log(" BarberShop SaaS");
console.log("======================================");
console.log(`Servidor funcionando en puerto ${PORT}`);
console.log(`URL: http://localhost:${PORT}`);
console.log("======================================");
console.log("");
});