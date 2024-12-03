const express = require('express');
const router = express.Router();
const db = require("../models/Reporte_Semanal");

/*

db.run para INSERT, UPDATE, DELETE
db.all para SELECT
*/

// Crear un registro en Reporte_Semanal
router.post("/", (req, res) => {
    const { fecha_inicio, fecha_fin, total_consumo, costo_total } = req.body;
    db.run(
        "INSERT INTO Reporte_Semanal (fecha_inicio, fecha_fin, total_consumo, costo_total) VALUES (?, ?, ?, ?)",
        [fecha_inicio, fecha_fin, total_consumo, costo_total],
        function (err) {
            if (err) {
                res.status(400).json({ error: err.message });
            } else {
                res.json({ id: this.lastID });
            }
        }
    );
});

// Obtener todos los registros de Reporte_Semanal
router.get("/", (req, res) => {
    db.all("SELECT * FROM Reporte_Semanal", [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json({ data: rows });
        }
    });
});

// Obtener un registro de Reporte_Semanal por ID
router.get("/:id_reporte", (req, res) => {
    const { id_reporte } = req.params;
    db.get(
        "SELECT * FROM Reporte_Semanal WHERE id_reporte = ?",
        [id_reporte],
        (err, row) => {
            if (err) {
                res.status(500).json({ error: err.message });
            } else {
                res.json({ data: row });
            }
        }
    );
});

// Actualizar un registro de Reporte_Semanal
router.put("/:id_reporte", (req, res) => {
    const { fecha_inicio, fecha_fin, total_consumo, costo_total } = req.body;
    const { id_reporte } = req.params;
    db.run(
        "UPDATE Reporte_Semanal SET fecha_inicio = ?, fecha_fin = ?, total_consumo = ?, costo_total = ? WHERE id_reporte = ?",
        [fecha_inicio, fecha_fin, total_consumo, costo_total, id_reporte],
        function (err) {
            if (err) {
                res.status(400).json({ error: err.message });
            } else {
                res.json({ updatedID: id_reporte });
            }
        }
    );
});

// Eliminar un registro de Reporte_Semanal
router.delete("/:id_reporte", (req, res) => {
    const { id_reporte } = req.params;
    db.run(
        "DELETE FROM Reporte_Semanal WHERE id_reporte = ?",
        [id_reporte],
        function (err) {
            if (err) {
                res.status(400).json({ error: err.message });
            } else {
                res.json({ deletedID: id_reporte });
            }
        }
    );
});

module.exports = router;