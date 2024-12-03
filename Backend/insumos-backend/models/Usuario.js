const { DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
const sequelize = require('../database');

// Definir el modelo Usuario
const Usuario = sequelize.define('Usuario', {
  id_usuario: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  contraseña: {
    type: DataTypes.STRING,
    allowNull: true, // Permite que sea null si no se requiere
  },
  refresco: {
    type: DataTypes.STRING, // Guardamos el refresh token aquí
    allowNull: true,
  },
}, {
  tableName: 'Usuario',
  timestamps: false, // Agrega createdAt y updatedAt automáticamente
});

// Método para comparar la contraseña
Usuario.prototype.validarContraseña = async function(password) {
  return await bcrypt.compare(password, this.contraseña);
};

// Método para actualizar el refresh_token
Usuario.prototype.actualizarRefreshToken = async function(refreshToken) {
  this.refresh_token = refreshToken;
  await this.save();
};

// Método para encriptar la contraseña antes de guardar
Usuario.beforeCreate(async (usuario) => {
  if(usuario.contraseña != null)
  {
    const hashedPassword = await bcrypt.hash(usuario.contraseña, 10);
    usuario.contraseña = hashedPassword;
  }
});

module.exports = Usuario;
