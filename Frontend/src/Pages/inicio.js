import React from 'react';
import { useNavigate } from 'react-router-dom';

function Inicio() {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <div className="d-flex flex-column justify-content-center align-items-center vh-100">
      <h1>Hola mundo</h1>
      <button onClick={handleLogout} className="btn btn-danger mt-3">
        Cerrar Sesión
      </button>
    </div>
  );
}

export default Inicio;
