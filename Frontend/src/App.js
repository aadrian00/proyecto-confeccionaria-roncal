import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.js'
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import MainNav from './Components/MainNav';
import Login from "./Components/Login";
import Inicio from './Pages/inicio'; // Sin la mayúscula en 'I'
import Reporte from './Pages/Reporte';
import CrearInsumosPage from './Pages/PaginaCrearInsumos';
import EditarInsumoPage from './Pages/PaginaEditarInsumos';
import Historico from './Pages/Historico';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const token = localStorage.getItem('access_token');
      setIsAuthenticated(!!token);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Router>
      <MainNav/>
      <Routes>
        <Route path="/login" element={isAuthenticated ? <Navigate to="/inicio" replace/> : <Login/>} />
        <Route path="/inicio" element={<Inicio />} />
        <Route path="/reporte" element={<Reporte />} />
        <Route path="/historico" element={<Historico />} />
        <Route path="/crearInsumo" element={<CrearInsumosPage />}/>
        <Route path="/editar-insumo/:id" element={<EditarInsumoPage />} />
        <Route path="*" element={isAuthenticated ? <Navigate to="/inicio" replace/> : <Navigate to="/login" replace/>}/>
      </Routes>
    </Router>
  );
}

export default App;