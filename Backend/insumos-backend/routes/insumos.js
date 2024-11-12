const express = require('express');
const Insumo = require('../models/Insumo');
const router = express.Router();

// Ruta para crear un insumo
router.post('/insumos', async (req, res) => {
  console.log("Datos recibidos: ", req.body); // Verifica los datos recibidos
  const { nombre_insumo, descripcion, stock_actual, stock_minimo } = req.body;

  try {
    const nuevoInsumo = await Insumo.create({ nombre_insumo, descripcion, stock_actual, stock_minimo });
    res.status(201).json({ message: 'Insumo creado exitosamente', insumo: nuevoInsumo });
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
router.get('/insumos/:id', async (req, res) => {
  const { id_insumo } = req.params;
  try {
    const insumo = await Insumo.findByPk(id_insumo);
    if (!insumo) {
      return res.status(404).json({ message: 'Insumo no encontrado' });
    }
    res.status(200).json(insumo);
  } catch (error) {
    console.error('Error al obtener el insumo:', error);
    res.status(500).json({ message: 'Error al obtener el insumo' });
  }
});

// Ruta para actualizar un insumo
router.put('/insumos/:id', async (req, res) => {
  const { id_insumo } = req.params;
  const { nombre_insumo, descripcion, stock_actual, stock_minimo } = req.body;
  try {
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
  } catch (error) {
    console.error('Error al actualizar el insumo:', error);
    res.status(500).json({ message: 'Error al actualizar el insumo' });
  }
});

// Ruta para eliminar un insumo
router.delete('/insumos/:id', async (req, res) => {
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

module.exports = router;
