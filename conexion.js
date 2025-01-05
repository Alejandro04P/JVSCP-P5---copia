/*const { Sequelize } = require('sequelize');
require('dotenv').config(); 

// Inicializar Sequelize con la configuración desde el archivo .env
const sequelize = new Sequelize(
  process.env.DATABASE_NAME, 
  process.env.DATABASE_USER, 
  process.env.DATABASE_PASSWORD, 
  {
    host: process.env.DATABASE_HOST || 'localhost', // Cambia si usas un servidor remoto
    dialect: 'postgres', // Especifica el dialecto PostgreSQL
    port: process.env.DATABASE_PORT || 5432, // Puerto por defecto de PostgreSQL
    logging: false, // Desactiva el logging (opcional)
  }
);

async function verifyConection () {
    try {
        return sequelize.authenticate();
    } catch (error) {
            console.log(error)
    }
}

module.exports = {verifyConection, sequelize};
*/
const { Sequelize } = require('sequelize');
require('dotenv').config();

// Conexión usando la URL completa de la base de datos
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres', // Especifica PostgreSQL como dialecto
  logging: false,      // Opcional: desactiva los logs de SQL
});

// Verificar conexión
async function verifyConection() {
  try {
    await sequelize.authenticate();
    console.log('Conexión exitosa a la base de datos.');
  } catch (error) {
    console.error('Error al conectar a la base de datos:', error);
  }
}

module.exports = { verifyConection, sequelize };
