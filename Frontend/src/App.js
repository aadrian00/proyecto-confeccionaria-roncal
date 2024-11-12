import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.js'
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainNav from './components/MainNav';
import Login from './Login/login';
import Inicio from './Pages/inicio';
import Reporte from './Pages/Reporte';
import CrearInsumosPage from './EditarInsumos/PaginaCrearInsumos';
import EditarInsumoPage from './EditarInsumos/PaginaEditarInsumos';

function App() {
  return (
    <Router>
      <MainNav/>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/inicio" element={<Inicio />} />
        <Route path="/reporte" element={<Reporte />} />
        <Route path="/crearInsumo" element={<CrearInsumosPage />}/>
        <Route path="/editar-insumo/:id" element={<EditarInsumoPage />} />
      </Routes>
    </Router>
  );
}

export default App;