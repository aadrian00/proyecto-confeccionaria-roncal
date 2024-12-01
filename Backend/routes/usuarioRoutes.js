const express = require('express');
const router = express.Router();
const db = require("../models/Usuario");

/*

db.run para INSERT, UPDATE, DELETE
db.all para SELECT
*/

// Crear un usuario
router.post("/", (req, res) => {
    const { nombre, email, contraseña } = req.body;
    db.run(
        "INSERT INTO Usuario (nombre, email, contraseña) VALUES (?, ?, ?)",
        [nombre, email, contraseña],
        function (err) {
            if (err) {
                res.status(400).json({ error: err.message });
            } else {
                res.json({ id: this.lastID });
            }
        }
    );
});

// Obtener todos los usuarios
router.get("/", (req, res) => {
    db.all("SELECT id_usuario, nombre, email FROM Usuario", [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json({ data: rows });
        }
    });
});

// Obtener un usuario por ID
router.get("/:id_usuario", (req, res) => {
    const { id_usuario } = req.params;
    db.get(
        "SELECT id_usuario, nombre, email FROM Usuario WHERE id_usuario = ?",
        [id_usuario],
        (err, row) => {
            if (err) {
                res.status(500).json({ error: err.message });
            } else {
                res.json({ data: row });
            }
        }
    );
});

// Actualizar un usuario
router.put("/:id_usuario", (req, res) => {
    const { nombre, email, contraseña } = req.body;
    const { id_usuario } = req.params;
    db.run(
        "UPDATE Usuario SET nombre = ?, email = ?, contraseña = ? WHERE id_usuario = ?",
        [nombre, email, contraseña, id_usuario],
        function (err) {
            if (err) {
                res.status(400).json({ error: err.message });
            } else {
                res.json({ updatedID: id_usuario });
            }
        }
    );
});

// Eliminar un usuario
router.delete("/:id_usuario", (req, res) => {
    const { id_usuario } = req.params;
    db.run(
        "DELETE FROM Usuario WHERE id_usuario = ?",
        [id_usuario],
        function (err) {
            if (err) {
                res.status(400).json({ error: err.message });
            } else {
                res.json({ deletedID: id_usuario });
            }
        }
    );
});

module.exports = router;