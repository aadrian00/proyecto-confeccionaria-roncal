const express = require('express');
const router = express.Router();
const db = require("../models/Historial_Insumo");

/*

db.run para INSERT, UPDATE, DELETE
db.all para SELECT
*/

// Crear un registro en el historial de insumos
router.post("/", (req, res) => {
    const { id_insumo, id_usuario, cantidad, tipo_movimiento, fecha } = req.body;
    db.run(
        `INSERT INTO Historial_Insumo (id_insumo, id_usuario, cantidad, tipo_movimiento, fecha) 
        VALUES (?, ?, ?, ?, ?)`,
        [id_insumo, id_usuario, cantidad, tipo_movimiento, fecha],
        function (err) {
            if (err) {
                res.status(400).json({ error: err.message });
            } else {
                res.json({ id: this.lastID });
            }
        }
    );
});

// Obtener todo el historial de insumos
router.get("/", (req, res) => {
    db.all("SELECT * FROM Historial_Insumo", [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json({ data: rows });
        }
    });
});

// Obtener un registro del historial de insumos por ID
router.get("/:id_historial_insumo", (req, res) => {
    const { id_historial_insumo } = req.params;
    db.get(
        "SELECT * FROM Historial_Insumo WHERE id_historial_insumo = ?",
        [id_historial_insumo],
        (err, row) => {
            if (err) {
                res.status(500).json({ error: err.message });
            } else if (!row) {
                res.status(404).json({ error: "Registro no encontrado" });
            } else {
                res.json({ data: row });
            }
        }
    );
});

// Actualizar un registro del historial de insumos
router.put("/:id_historial_insumo", (req, res) => {
    const { id_insumo, id_usuario, cantidad, tipo_movimiento, fecha } = req.body;
    const { id_historial_insumo } = req.params;
    db.run(
        `UPDATE Historial_Insumo 
        SET id_insumo = ?, id_usuario = ?, cantidad = ?, tipo_movimiento = ?, fecha = ? 
        WHERE id_historial_insumo = ?`,
        [id_insumo, id_usuario, cantidad, tipo_movimiento, fecha, id_historial_insumo],
        function (err) {
            if (err) {
                res.status(400).json({ error: err.message });
            } else if (this.changes === 0) {
                res.status(404).json({ error: "Registro no encontrado" });
            } else {
                res.json({ updatedID: id_historial_insumo });
            }
        }
    );
});

// Eliminar un registro del historial de insumos
router.delete("/:id_historial_insumo", (req, res) => {
    const { id_historial_insumo } = req.params;
    db.run(
        "DELETE FROM Historial_Insumo WHERE id_historial_insumo = ?",
        [id_historial_insumo],
        function (err) {
            if (err) {
                res.status(400).json({ error: err.message });
            } else if (this.changes === 0) {
                res.status(404).json({ error: "Registro no encontrado" });
            } else {
                res.json({ deletedID: id_historial_insumo });
            }
        }
    );
});

module.exports = router;