const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./database.sqlite", (err) => {
  if (err) {
    console.error("Error al conectar con la base de datos:", err.message);
  } else {
    console.log("Conectado a la base de datos SQLite");
  }
});

db.run(`CREATE TABLE IF NOT EXISTS Notificaciones (
    id_notificacion INTEGER PRIMARY KEY AUTOINCREMENT,
    id_usuario INTEGER NOT NULL,
    id_insumo INTEGER NOT NULL,
    mensaje TEXT NOT NULL,
    fecha DATETIME NOT NULL,
    estado TEXT CHECK (estado IN ('leída', 'no leída')),
    FOREIGN KEY (id_usuario) REFERENCES Usuario (id_usuario),
    FOREIGN KEY (id_insumo) REFERENCES Insumo (id_insumo)
)`);

module.exports = db;
