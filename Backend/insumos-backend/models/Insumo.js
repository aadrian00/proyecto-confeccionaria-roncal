const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Insumo = sequelize.define('Insumo', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  cantidad: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  descripcion: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  tableName: 'insumos', // Nombre de la tabla en la base de datos
  timestamps: false,    // Si no usas campos de timestamps (createdAt, updatedAt)
});

module.exports = Insumo;
