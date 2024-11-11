const { Sequelize } = require('sequelize');
require('dotenv').config();

const DB_SERVER = 'LAPTOP-AQF54JFE';
const DB_USER = 'Arnodorian020';
const DB_PASSWORD = '123456';
const DB_DATABASE = 'BD de Calidad';

const sequelize = new Sequelize(
  DB_DATABASE,
  DB_USER,
  DB_PASSWORD,
  {
    host: DB_SERVER,
    dialect: 'mssql', // Usamos SQL Server
    logging: false, // Para evitar que Sequelize imprima las consultas SQL en consola
  }
);

module.exports = sequelize;