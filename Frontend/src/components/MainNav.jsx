import React from 'react'
import { Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react';


function MainNav() {

  const navItems = [
    { texto: "Insumos", ruta:"/crearInsumo"},
    { texto: "Histórico", ruta: "/historico"},
    { texto: "Reporte Semanal", ruta: "/reporte"}
  ]
  
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      setIsAuthenticated(true);  // El usuario está autenticado
    } else {
      setIsAuthenticated(false);  // No hay token, no autenticado
    }
  }, []);  // Solo cuando se monta el componente

  // Actualiza el estado cada vez que se cambie el token en localStorage
  useEffect(() => {
    // Esto va a escuchar cambios en el localStorage directamente
    const interval = setInterval(() => {
      const token = localStorage.getItem('access_token');
      const token1 = localStorage.getItem('authToken');
      if (token || token1) {
        setIsAuthenticated(true); // El token existe
      } else {
        setIsAuthenticated(false); // El token no existe
      }
    }, 1000); // Verifica cada segundo

    return () => clearInterval(interval);  // Limpiar intervalo cuando el componente se desmonta
  }, []);


  console.log(isAuthenticated);

  const cerrarSesion = () => {
     // Elimina el token del localStorage (o sessionStorage, dependiendo de donde lo guardes)
     localStorage.removeItem('access_token');
     localStorage.removeItem('authToken')
     localStorage.removeItem('email');
  
     setIsAuthenticated(false);

      // Redirige al usuario a la página de inicio o login
      window.location.href = '/login';
  }

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          Confeccionería Roncal
        </Link>
        
        {isAuthenticated && (
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
        </button>
        )}


        {isAuthenticated && (
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {navItems.map((item, index) => (
              <li key={index} className="nav-item">
                <Link to={item.ruta} className='nav-link'>
                  {item.texto}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        )}

        {isAuthenticated && (
          <Button variant="danger" onClick={cerrarSesion}>
            Cerrar Sesión
          </Button>
        )}
        
      </div>
    </nav>
    
  )
}

export default MainNav