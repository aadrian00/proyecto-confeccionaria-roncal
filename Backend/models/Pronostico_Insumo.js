const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./database.sqlite", (err) => {
  if (err) {
    console.error("Error al conectar con la base de datos:", err.message);
  } else {
    console.log("Conectado a la base de datos SQLite");
  }
});

db.run(`CREATE TABLE IF NOT EXISTS Pronostico_Insumo (
    id_pronostico INTEGER PRIMARY KEY AUTOINCREMENT,
    id_insumo INTEGER NOT NULL,
    fecha_pronostico DATETIME NOT NULL,
    cantidad_pronosticada INTEGER NOT NULL,
    FOREIGN KEY (id_insumo) REFERENCES Insumo (id_insumo)
)`);

module.exports = db;
