const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./database.sqlite", (err) => {
  if (err) {
    console.error("Error al conectar con la base de datos:", err.message);
  } else {
    console.log("Conectado a la base de datos SQLite");
  }
});

db.run(`CREATE TABLE IF NOT EXISTS Reporte_Semanal (
    id_reporte INTEGER PRIMARY KEY AUTOINCREMENT,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    total_consumo INTEGER NOT NULL,
    costo_total REAL NOT NULL
)`);

module.exports = db;
