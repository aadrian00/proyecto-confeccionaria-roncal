const express = require('express');
const router = express.Router();
const db = require("../models/Pronostico_Insumo");

/*

db.run para INSERT, UPDATE, DELETE
db.all para SELECT
*/

// Crear un registro en Pronostico_Insumo
router.post("/", (req, res) => {
    const { id_insumo, fecha_pronostico, cantidad_pronosticada } = req.body;
    db.run(
        "INSERT INTO Pronostico_Insumo (id_insumo, fecha_pronostico, cantidad_pronosticada) VALUES (?, ?, ?)",
        [id_insumo, fecha_pronostico, cantidad_pronosticada],
        function (err) {
            if (err) {
                res.status(400).json({ error: err.message });
            } else {
                res.json({ id: this.lastID });
            }
        }
    );
});

// Obtener todos los registros de Pronostico_Insumo
router.get("/", (req, res) => {
    db.all("SELECT * FROM Pronostico_Insumo", [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json({ data: rows });
        }
    });
});

// Obtener un registro de Pronostico_Insumo por ID
router.get("/:id_pronostico", (req, res) => {
    const { id_pronostico } = req.params;
    db.get(
        "SELECT * FROM Pronostico_Insumo WHERE id_pronostico = ?",
        [id_pronostico],
        (err, row) => {
            if (err) {
                res.status(500).json({ error: err.message });
            } else {
                res.json({ data: row });
            }
        }
    );
});

// Actualizar un registro de Pronostico_Insumo
router.put("/:id_pronostico", (req, res) => {
    const { id_insumo, fecha_pronostico, cantidad_pronosticada } = req.body;
    const { id_pronostico } = req.params;
    db.run(
        "UPDATE Pronostico_Insumo SET id_insumo = ?, fecha_pronostico = ?, cantidad_pronosticada = ? WHERE id_pronostico = ?",
        [id_insumo, fecha_pronostico, cantidad_pronosticada, id_pronostico],
        function (err) {
            if (err) {
                res.status(400).json({ error: err.message });
            } else {
                res.json({ updatedID: id_pronostico });
            }
        }
    );
});

// Eliminar un registro de Pronostico_Insumo
router.delete("/:id_pronostico", (req, res) => {
    const { id_pronostico } = req.params;
    db.run(
        "DELETE FROM Pronostico_Insumo WHERE id_pronostico = ?",
        [id_pronostico],
        function (err) {
            if (err) {
                res.status(400).json({ error: err.message });
            } else {
                res.json({ deletedID: id_pronostico });
            }
        }
    );
});

module.exports = router;