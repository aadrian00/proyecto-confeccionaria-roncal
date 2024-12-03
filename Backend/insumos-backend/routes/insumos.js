const express = require('express');
const jwt = require('jsonwebtoken');
const Insumo = require('../models/Insumo');
const router = express.Router();
const { oauth2Client } = require('../index');
const { google } = require('googleapis');  // Asegúrate de que esta línea esté presente



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

    verificarStock(insumo);
    
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
  const {email} = req.body;
  try {
    if(email != null)
    {
    const insumo = await Insumo.findByPk(id_insumo);
    if (!insumo) {
      return res.status(404).json({ message: 'Insumo no encontrado' });
    }

    await insumo.destroy();
    res.status(200).json({ message: 'Insumo eliminado exitosamente' });
  }
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

// Función para enviar correo
const enviarCorreo = async (subject, body) => {
  const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

  const mensaje = [
    'Content-Type: text/plain; charset="UTF-8"\n',
    'MIME-Version: 1.0\n',
    `From: "Jean Pierre" <20191946@aloe.ulima.edu.pe>\n`,  // Cambia el correo de origen
    'To: 20191946@aloe.ulima.edu.pe\n',  // Cambia el correo de destino
    `Subject: ${subject}\n`,
    '\n',
    body
  ].join('');

  const base64EncodedMessage = Buffer.from(mensaje).toString('base64');

  console.log("Se alista para enviar el correo");

  try {
    await gmail.users.messages.send({
      userId: 'me',
      requestBody: {
        raw: base64EncodedMessage
      },
    });
    console.log('Correo enviado');
  } catch (error) {
    console.error('Error al enviar el correo:', error);
  }
};

// Función de verificación de stock
const verificarStock = (insumo) => {
  if (insumo.stock_actual <= insumo.stock_minimo) {
    const subject = `Stock bajo para el insumo ${insumo.nombre_insumo}`;
    const body = `El stock actual del insumo ${insumo.nombre_insumo} es de ${insumo.stock_actual}, lo cual es inferior o igual al stock mínimo de ${insumo.STOCK_MINIMO}. Es necesario reabastecer el inventario.`;
    console.log("Está por mandar el correo");
    enviarCorreo(subject, body);
  }
};

module.exports = router;
