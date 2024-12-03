const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const { google } = require('googleapis');
const Insumo = require('../models/Insumo');


// Middleware para verificar autenticación (usando JWT)
function isAuthenticated(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];  // Obtener el token del header Authorization

  if (!token) {
    return res.status(403).json({ message: 'No se proporcionó un token' });
  }

  // Verificar el token JWT
  jwt.verify(token, 'mi-secreto', (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Token inválido' });
    }
    req.user = decoded;  // Guardamos la información del usuario en la request
    next();
  });
}

// Ruta para crear un insumo
router.post('/insumos', async (req, res) => {
  console.log("Datos recibidos: ", req.body); // Verifica los datos recibidos
  const { nombre_insumo, descripcion, stock_actual, stock_minimo, email } = req.body;

  try {
    if(email != null)
    {
      const nuevoInsumo = await Insumo.create({ nombre_insumo, descripcion, stock_actual, stock_minimo });
      res.status(201).json({ message: 'Insumo creado exitosamente', insumo: nuevoInsumo });
    }
  } catch (error) {
    console.error('Error al crear el insumo:', error);
    res.status(500).json({ message: 'Error al crear el insumo', error: error.message });
  }
});

// Ruta para obtener todos los insumos
router.get('/insumos', async (req, res) => {
  try {
      const insumos = await Insumo.findAll();
      res.status(200).json(insumos);
    
  } catch (error) {
    console.error('Error al obtener los insumos:', error);
    res.status(500).json({ message: 'Error al obtener los insumos' });
  }
});

// Ruta para obtener un insumo por su ID
router.get('/insumos/:id_insumo', async (req, res) => {
  const { id_insumo } = req.params;
  try {
      const insumo = await Insumo.findByPk(id_insumo);
      if (!insumo) {
        return res.status(404).json({ message: "Insumo no encontrado" });
      }
      res.status(200).json(insumo);
  } catch (error) {
    console.error('Error al obtener el insumo:', error);
    res.status(500).json({ message: 'Error al obtener el insumo' });
  }
});

// Ruta para actualizar un insumo
router.put('/insumos/:id_insumo', async (req, res) => {
  const { id_insumo } = req.params;
  const { nombre_insumo, descripcion, stock_actual, stock_minimo, email } = req.body;
  try {
    if(email != null){
      
    
    const insumo = await Insumo.findByPk(id_insumo);
    if (!insumo) {
      return res.status(404).json({ message: 'Insumo no encontrado' });
    }

    insumo.nombre_insumo = nombre_insumo;
    insumo.descripcion = descripcion;
    insumo.stock_actual = stock_actual;
    insumo.stock_minimo = stock_minimo;
    await insumo.save();    
    res.status(200).json({ message: 'Insumo actualizado exitosamente', insumo });
  }
  } catch (error) {
    console.error('Error al actualizar el insumo:', error);
    res.status(500).json({ message: 'Error al actualizar el insumo' });
  }
});

// Ruta para eliminar un insumo
router.delete('/insumos/:id_insumo', async (req, res) => {
  const { id_insumo } = req.params;
  try {
    const insumo = await Insumo.findByPk(id_insumo);
    if (!insumo) {
      return res.status(404).json({ message: 'Insumo no encontrado' });
    }

    await insumo.destroy();
    res.status(200).json({ message: 'Insumo eliminado exitosamente' });

  } catch (error) {
    console.error('Error al eliminar el insumo:', error);
    res.status(500).json({ message: 'Error al eliminar el insumo' });
  }
});

// Ruta para login y obtener un token JWT
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Simulación de la verificación del usuario (cambiar por base de datos)
    if (username === 'admin' && password === '12345') {  // Reemplazar con validación real
      const token = jwt.sign({ username }, 'mi-secreto', { expiresIn: '1h' });
      return res.status(200).json({ success: true, token });
    } else {
      return res.status(401).json({ success: false, message: 'Credenciales incorrectas' });
    }
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    res.status(500).json({ success: false, message: 'Error al iniciar sesión' });
  }
});

// Verificar si el usuario está autenticado
router.get('/check-auth', isAuthenticated, (req, res) => {
  res.json({ authenticated: true, user: req.user });
});

// Ruta para logout
router.get('/logout', (req, res) => {
  res.json({ message: 'Logout exitoso' });
});

module.exports = router;
