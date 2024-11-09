import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './Login/login';
import Inicio from './Inicio/inicio';
import CrearInsumosPage from './EditarInsumos/PaginaCrearInsumos';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/inicio" element={<Inicio />} />
        <Route path="/crearInsumo" element={<CrearInsumosPage />}/>
      </Routes>
    </Router>
  );
}

export default App;