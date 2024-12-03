const express = require('express');
const router = express.Router();
const db = require("../models/Insumo");

/*

db.run para INSERT, UPDATE, DELETE
db.all para SELECT
*/

// Ruta para crear un insumo
router.post("/", (req, res) => {
    const { nombre_insumo, descripcion, stock_actual, stock_minimo } = req.body;
    db.run(
     "INSERT INTO Insumo (nombre_insumo, descripcion, stock_actual, stock_minimo) VALUES (?, ?, ?, ?)",
     [nombre_insumo, descripcion, stock_actual, stock_minimo],
     function (err) {
      if (err) {
       res.status(400).json({ error: err.message });
      } else {
      res.json({ id: this.lastID });
      }
     }
    );
});

// Obtener todos los insumos

router.get("/", (req, res) => {

    db.all("SELECT * FROM Insumo", [], (err, rows) => {
   
     if (err) {
   
      res.status(500).json({ error: err.message });
   
     } else {
   
      res.json({ data: rows });
   
     }
   
    });
   
   });

// Obtener insumos por ID

router.get("/:id", (req, res) => {

    const id_insumo = req.params.id;  // Obtiene el ID del insumo de la URL  

    db.get(`SELECT * FROM Insumo WHERE id_insumo = ?`, [id_insumo], (err, row) => {
   
     if (err) {
   
      res.status(500).json({ error: err.message });
   
     } else {
   
      res.json({ data: row });
   
     }
   
    });
   
   });

//Actualizar insumo

router.put("/:id_insumo", (req, res) => {
    const { nombre_insumo, descripcion, stock_actual, stock_minimo } = req.body;
    const { id_insumo } = req.params;
    db.run(
      "UPDATE Insumo SET nombre_insumo = ?, descripcion = ?, stock_actual = ?, stock_minimo = ? WHERE id_insumo = ?",
      [nombre_insumo, descripcion, stock_actual, stock_minimo, id_insumo],
      function (err) {
        if (err) {
          res.status(400).json({ error: err.message });
        } else {
          res.json({ updatedID: id_insumo });
        }
      }
    );
  });

// Eliminar un Insumo

router.delete("/:id_insumo", (req, res) => {
    const { id_insumo } = req.params;
    db.run("DELETE FROM Insumo WHERE id_insumo = ?", [id_insumo], function (err) {
      if (err) {
        res.status(400).json({ error: err.message });
      } else {
        res.json({ deletedID: id_insumo });
      }
    });
  });
  
  module.exports = router;