const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Insumo = sequelize.define('Insumo', {
  id_insumo: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nombre_insumo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  descripcion: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  stock_actual: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  stock_minimo: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  notificado: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  }
}, {
  tableName: 'Insumo', // Nombre de la tabla en la base de datos
  timestamps: false,    // Si no usas campos de timestamps (createdAt, updatedAt)
});

module.exports = Insumo;
