const express = require('express');
const router = express.Router();
const db = require("../models/Historial_Sesion");

/*

db.run para INSERT, UPDATE, DELETE
db.all para SELECT
*/

// Crear un registro en Historial_Sesion
router.post("/", (req, res) => {
    const { id_usuario, fecha_inicio, fecha_cierre } = req.body;
    db.run(
        "INSERT INTO Historial_Sesion (id_usuario, fecha_inicio, fecha_cierre) VALUES (?, ?, ?)",
        [id_usuario, fecha_inicio, fecha_cierre],
        function (err) {
            if (err) {
                res.status(400).json({ error: err.message });
            } else {
                res.json({ id: this.lastID });
            }
        }
    );
});

// Obtener todos los registros de Historial_Sesion
router.get("/", (req, res) => {
    db.all("SELECT * FROM Historial_Sesion", [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json({ data: rows });
        }
    });
});

// Obtener un registro de Historial_Sesion por ID
router.get("/:id_historial_sesion", (req, res) => {
    const { id_historial_sesion } = req.params;
    db.get(
        "SELECT * FROM Historial_Sesion WHERE id_historial_sesion = ?",
        [id_historial_sesion],
        (err, row) => {
            if (err) {
                res.status(500).json({ error: err.message });
            } else {
                res.json({ data: row });
            }
        }
    );
});

// Actualizar un registro de Historial_Sesion
router.put("/:id_historial_sesion", (req, res) => {
    const { id_usuario, fecha_inicio, fecha_cierre } = req.body;
    const { id_historial_sesion } = req.params;
    db.run(
        "UPDATE Historial_Sesion SET id_usuario = ?, fecha_inicio = ?, fecha_cierre = ? WHERE id_historial_sesion = ?",
        [id_usuario, fecha_inicio, fecha_cierre, id_historial_sesion],
        function (err) {
            if (err) {
                res.status(400).json({ error: err.message });
            } else {
                res.json({ updatedID: id_historial_sesion });
            }
        }
    );
});

// Eliminar un registro de Historial_Sesion
router.delete("/:id_historial_sesion", (req, res) => {
    const { id_historial_sesion } = req.params;
    db.run(
        "DELETE FROM Historial_Sesion WHERE id_historial_sesion = ?",
        [id_historial_sesion],
        function (err) {
            if (err) {
                res.status(400).json({ error: err.message });
            } else {
                res.json({ deletedID: id_historial_sesion });
            }
        }
    );
});

module.exports = router;