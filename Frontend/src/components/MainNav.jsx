import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function MainNav() {
  const navItems = [
    { texto: "Insumos", ruta: "/crearInsumo" },
    { texto: "Histórico", ruta: "/historico" },
    { texto: "Reporte Semanal", ruta: "/reporte" },
  ];

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    setIsAuthenticated(!!token);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const token = localStorage.getItem('access_token');
      setIsAuthenticated(!!token);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const cerrarSesion = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('email');
    setIsAuthenticated(false);
    window.location.href = '/login';
  };

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          Confeccionería Roncal
        </Link>

        {isAuthenticated && (
          <>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="navbarSupportedContent">
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                {navItems.map((item, index) => (
                  <li key={index} className="nav-item">
                    <Link to={item.ruta} className="nav-link">
                      {item.texto}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <button className="btn btn-danger" onClick={cerrarSesion}>
              Cerrar Sesión
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

export default MainNav;
