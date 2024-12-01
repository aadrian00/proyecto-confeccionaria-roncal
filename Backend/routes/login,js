const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const router = express.Router();

router.post("/", (req, res) => {
  const { email, contrasena } = req.body;

  // Verificar que los campos no estén vacíos
  if (!email || !contrasena) {
    return res.status(400).json({ message: "Email y contraseña son requeridos." });
  }

  // Conectar a la base de datos SQLite
  const db = new sqlite3.Database("./database.sqlite", (err) => {
    if (err) {
      return res.status(500).json({ message: "Error al conectar con la base de datos", error: err });
    }
  });

  // Buscar el usuario por email
  db.get("SELECT * FROM Usuario WHERE email = ?", [email], (err, row) => {
    if (err) {
      return res.status(500).json({ message: "Error en la base de datos", error: err });
    }
    if (!row) {
      return res.status(400).json({ message: "Email o contraseña incorrectos." });
    }

    if (row.contrasena === contrasena) {
      // Contraseña correcta
      res.status(200).json({ message: "Login exitoso", user: { id_usuario: row.id_usuario, nombre: row.nombre } });
    } else {
      // Contraseña incorrecta
      res.status(400).json({ message: "Email o contraseña incorrectos." });
    }
  });

  db.close();
});

module.exports = router;
