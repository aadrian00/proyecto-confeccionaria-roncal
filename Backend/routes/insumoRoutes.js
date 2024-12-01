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

    // Validación de los datos recibidos
    if (!nombre_insumo || stock_actual === undefined || stock_minimo === undefined) {
        return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    db.run(
        "INSERT INTO Insumo (nombre_insumo, descripcion, stock_actual, stock_minimo) VALUES (?, ?, ?, ?)",
        [nombre_insumo, descripcion, stock_actual, stock_minimo],
        function (err) {
            if (err) {
                res.status(400).json({ error: err.message });
            } else {
                res.json({
                    id_insumo: this.lastID,
                    nombre_insumo,
                    descripcion,
                    stock_actual,
                    stock_minimo,
                });
            }
        }
    );
});

// Obtener todos los insumos
router.get("/", (req, res) => {
    db.all("SELECT * FROM Insumo", [], (err, rows) => {
        if (err) {
            console.error("Error en la consulta:", err.message);
            res.status(500).json({ error: err.message });
        } else {
            console.log("Datos obtenidos:", rows);
            res.json({ data: rows });
        }
    });
});

// Obtener solo IDs de los insumos
router.get("/ids", (req, res) => {
    db.all("SELECT id_insumo FROM Insumo", [], (err, rows) => {
        if (err) {
            console.error("Error en la consulta de IDs:", err.message);
            res.status(500).json({ error: err.message });
        } else {
            res.json({ data: rows });
        }
    });
});

// Actualizar insumo
router.put("/:id_insumo", (req, res) => {
    const { nombre_insumo, descripcion, stock_actual, stock_minimo } = req.body;
    const { id_insumo } = req.params;

    // Validación de los datos recibidos
    if (!nombre_insumo || stock_actual === undefined || stock_minimo === undefined) {
        return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

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

// Eliminar un insumo
router.delete("/:id_insumo", (req, res) => {
    const { id_insumo } = req.params;
    db.run("DELETE FROM Insumo WHERE id_insumo = ?", id_insumo, function (err) {
        if (err) {
            res.status(400).json({ error: err.message });
        } else {
            res.json({ deletedID: id_insumo });
        }
    });
});

module.exports = router;
