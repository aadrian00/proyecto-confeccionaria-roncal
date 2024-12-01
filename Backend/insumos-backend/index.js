const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Rutas existentes

const alertasRoutes = require("./routes/alertasRoutes");
const historial_insumoRoutes = require("./routes/historial_insumoRoutes");
const historial_sesionRoutes = require("./routes/historial_sesionRoutes");
const insumoRoutes = require("./routes/insumoRoutes");
const notificacionesRoutes = require("./routes/notificacionesRoutes");
const pronostico_insumoRoutes = require("./routes/pronostico_insumoRoutes");
const reporte_semanalRoutes = require("./routes/reporte_semanalRoutes");
const usuarioRoutes = require("./routes/usuarioRoutes");

app.use("/Alertas", alertasRoutes);
app.use("/Historial_Insumo", historial_insumoRoutes);
app.use("/Historial_Sesion", historial_sesionRoutes);
app.use("/Insumo", insumoRoutes);
app.use("/Notificaciones", notificacionesRoutes);
app.use("/Pronostico_Insumo", pronostico_insumoRoutes);
app.use("/Reporte_Semanal", reporte_semanalRoutes);
app.use("/Usuarios", usuarioRoutes);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});