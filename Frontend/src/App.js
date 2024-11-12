import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.js'
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainNav from './components/MainNav';
import Login from './Login/login';
import Inicio from './Pages/inicio';
import Reporte from './Pages/Reporte';

function App() {
  return (
    <Router>
      <MainNav/>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/inicio" element={<Inicio />} />
        <Route path="/reporte" element={<Reporte />} />
      </Routes>
    </Router>
  );
}

export default App;