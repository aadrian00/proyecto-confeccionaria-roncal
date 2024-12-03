const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./database.sqlite", (err) => {
  if (err) {
    console.error("Error al conectar con la base de datos:", err.message);
  } else {
    console.log("Conectado a la base de datos SQLite");
  }
});

db.run(`CREATE TABLE IF NOT EXISTS Historial_Insumo (
    id_historial_insumo INTEGER PRIMARY KEY AUTOINCREMENT,
    id_insumo INTEGER NOT NULL,
    id_usuario INTEGER NOT NULL,
    cantidad INTEGER NOT NULL,
    tipo_movimiento TEXT CHECK (tipo_movimiento IN ('ingreso', 'egreso')),
    fecha DATETIME NOT NULL,
    FOREIGN KEY (id_insumo) REFERENCES Insumo (id_insumo),
    FOREIGN KEY (id_usuario) REFERENCES Usuario (id_usuario)
)`);

module.exports = db;
