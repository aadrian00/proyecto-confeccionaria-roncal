import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.js'
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainNav from './Components/MainNav';
import Login from "./Components/Login";
import Inicio from './Pages/Inicio';
import Reporte from './Pages/Reporte';
import CrearInsumosPage from './Pages/PaginaCrearInsumos';
import EditarInsumoPage from './Pages/PaginaEditarInsumos';
import Historico from './Pages/Historico';
import ConfirmModal from './Components/ConfirmacionModal.component';

function App() {
  return (
    <Router>
      <MainNav/>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/inicio" element={<Inicio />} />
        <Route path="/reporte" element={<Reporte />} />
        <Route path="/historico" element={<Historico />} />
        <Route path="/crearInsumo" element={<CrearInsumosPage />}/>
        <Route path="/editar-insumo/:id" element={<EditarInsumoPage />} />
      </Routes>
    </Router>
  );
}

export default App;