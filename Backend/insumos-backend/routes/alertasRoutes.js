const express = require('express');
const router = express.Router();
const db = require("../models/Alertas");

/*

db.run para INSERT, UPDATE, DELETE
db.all para SELECT
*/

// Crear una alerta
router.post("/", (req, res) => {
    const { id_usuario, id_insumo, tipo_alerta, umbral, frecuencia } = req.body;
    db.run(
        `INSERT INTO Alertas (id_usuario, id_insumo, tipo_alerta, umbral, frecuencia) 
        VALUES (?, ?, ?, ?, ?)`,
        [id_usuario, id_insumo, tipo_alerta, umbral, frecuencia],
        function (err) {
            if (err) {
                res.status(400).json({ error: err.message });
            } else {
                res.json({ id: this.lastID });
            }
        }
    );
});

// Obtener todas las alertas
router.get("/", (req, res) => {
    db.all("SELECT * FROM Alertas", [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json({ data: rows });
        }
    });
});

// Obtener una alerta por ID
router.get("/:id_alerta", (req, res) => {
    const { id_alerta } = req.params;
    db.get("SELECT * FROM Alertas WHERE id_alerta = ?", [id_alerta], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else if (!row) {
            res.status(404).json({ error: "Alerta no encontrada" });
        } else {
            res.json({ data: row });
        }
    });
});

// Actualizar una alerta
router.put("/:id_alerta", (req, res) => {
    const { id_usuario, id_insumo, tipo_alerta, umbral, frecuencia } = req.body;
    const { id_alerta } = req.params;
    db.run(
        `UPDATE Alertas 
        SET id_usuario = ?, id_insumo = ?, tipo_alerta = ?, umbral = ?, frecuencia = ? 
        WHERE id_alerta = ?`,
        [id_usuario, id_insumo, tipo_alerta, umbral, frecuencia, id_alerta],
        function (err) {
            if (err) {
                res.status(400).json({ error: err.message });
            } else if (this.changes === 0) {
                res.status(404).json({ error: "Alerta no encontrada" });
            } else {
                res.json({ updatedID: id_alerta });
            }
        }
    );
});

// Eliminar una alerta
router.delete("/:id_alerta", (req, res) => {
    const { id_alerta } = req.params;
    db.run("DELETE FROM Alertas WHERE id_alerta = ?", [id_alerta], function (err) {
        if (err) {
            res.status(400).json({ error: err.message });
        } else if (this.changes === 0) {
            res.status(404).json({ error: "Alerta no encontrada" });
        } else {
            res.json({ deletedID: id_alerta });
        }
    });
});

module.exports = router;