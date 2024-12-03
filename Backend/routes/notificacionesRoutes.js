const express = require('express');
const router = express.Router();
const db = require("../models/Notificaciones");

/*

db.run para INSERT, UPDATE, DELETE
db.all para SELECT
*/

// Crear una notificación
router.post("/", (req, res) => {
    const { id_usuario, id_insumo, mensaje, fecha, estado } = req.body;
    db.run(
        `INSERT INTO Notificaciones (id_usuario, id_insumo, mensaje, fecha, estado) 
        VALUES (?, ?, ?, ?, ?)`,
        [id_usuario, id_insumo, mensaje, fecha, estado],
        function (err) {
            if (err) {
                res.status(400).json({ error: err.message });
            } else {
                res.json({ id: this.lastID });
            }
        }
    );
});

// Obtener todas las notificaciones
router.get("/", (req, res) => {
    db.all("SELECT * FROM Notificaciones", [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json({ data: rows });
        }
    });
});

// Obtener notificaciones por ID
router.get("/:id_notificacion", (req, res) => {
    const { id_notificacion } = req.params;
    db.get("SELECT * FROM Notificaciones WHERE id_notificacion = ?", [id_notificacion], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else if (!row) {
            res.status(404).json({ error: "Notificación no encontrada" });
        } else {
            res.json({ data: row });
        }
    });
});

// Actualizar una notificación
router.put("/:id_notificacion", (req, res) => {
    const { id_usuario, id_insumo, mensaje, fecha, estado } = req.body;
    const { id_notificacion } = req.params;
    db.run(
        `UPDATE Notificaciones 
        SET id_usuario = ?, id_insumo = ?, mensaje = ?, fecha = ?, estado = ? 
        WHERE id_notificacion = ?`,
        [id_usuario, id_insumo, mensaje, fecha, estado, id_notificacion],
        function (err) {
            if (err) {
                res.status(400).json({ error: err.message });
            } else if (this.changes === 0) {
                res.status(404).json({ error: "Notificación no encontrada" });
            } else {
                res.json({ updatedID: id_notificacion });
            }
        }
    );
});

// Eliminar una notificación
router.delete("/:id_notificacion", (req, res) => {
    const { id_notificacion } = req.params;
    db.run("DELETE FROM Notificaciones WHERE id_notificacion = ?", [id_notificacion], function (err) {
        if (err) {
            res.status(400).json({ error: err.message });
        } else if (this.changes === 0) {
            res.status(404).json({ error: "Notificación no encontrada" });
        } else {
            res.json({ deletedID: id_notificacion });
        }
    });
});

module.exports = router;