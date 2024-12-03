const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./database.sqlite", (err) => {
  if (err) {
    console.error("Error al conectar con la base de datos:", err.message);
  } else {
    console.log("Conectado a la base de datos SQLite");
  }
});

db.run(`CREATE TABLE IF NOT EXISTS Historial_Sesion (
    id_historial_sesion INTEGER PRIMARY KEY AUTOINCREMENT,
    id_usuario INTEGER NOT NULL,
    fecha_inicio DATETIME NOT NULL,
    fecha_cierre DATETIME,
    FOREIGN KEY (id_usuario) REFERENCES Usuario (id_usuario)
)`);

module.exports = db;
