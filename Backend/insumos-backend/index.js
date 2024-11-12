const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./database');
const insumosRoutes = require('./routes/insumos');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json()); // Para parsear el cuerpo de las peticiones JSON

// Rutas
app.use('/api', insumosRoutes);

// Conectar a la base de datos
sequelize.sync()
  .then(() => {
    console.log('Conexión a la base de datos establecida');
    app.listen(port, () => {
      console.log(`Servidor escuchando en el puerto ${port}`);
    });
  })
  .catch((error) => {
    console.error('Error al conectar con la base de datos:', error);
  });