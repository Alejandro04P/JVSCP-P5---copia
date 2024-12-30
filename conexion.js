const { Sequelize } = require('sequelize');
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
