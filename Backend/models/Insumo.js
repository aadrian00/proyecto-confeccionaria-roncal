const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./database.sqlite", (err) => {
  if (err) {
    console.error("Error al conectar con la base de datos:", err.message);
  } else {
    console.log("Conectado a la base de datos SQLite");
  }
});

db.run(`CREATE TABLE IF NOT EXISTS Insumo (
    id_insumo INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre_insumo TEXT NOT NULL,
    descripcion TEXT,
    stock_actual INTEGER NOT NULL,
    stock_minimo INTEGER NOT NULL
)`);

module.exports = db;
