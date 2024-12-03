import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function MainNav() {
  const navItems = [
    { texto: "Insumos", ruta: "/crearInsumo" },
    { texto: "Histórico", ruta: "/historico" },
    { texto: "Reporte Semanal", ruta: "/reporte" },
  ];

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [verNotificaciones, setVerNotificaciones] = useState(false);
  const [notificacionStock, setNotificacionStock] = useState(false);
  const [valorRango, setValorRango] = useState(20);

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

  useEffect(() => {
    const interval = setInterval(() => {
      const token = localStorage.getItem('access_token');
      setIsAuthenticated(!!token);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const cerrarSesion = () => {
     // Elimina el token del localStorage (o sessionStorage, dependiendo de donde lo guardes)
     localStorage.removeItem('access_token');
     localStorage.removeItem('authToken')
     localStorage.removeItem('email');
  }

  const dibujarConfigModal = () => {
    return(
      <div class="modal fade" id="configModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h1 class="modal-title fs-5" id="configModalLabel">Configuración de Notificaciones</h1>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <form>
              <div class="modal-body">
                <div className="mb-3 input">
                    <input type="checkbox" className='form-check-input me-2 mb-3' id='checkNotif'
                      onChange={(event) => setVerNotificaciones(event.target.checked)}/>
                    <label htmlForfor="checkNotif" className='form-check-label'>Enviar notificaciones</label>
                  {verNotificaciones &&
                    <div>
                      <div>
                        <input type="checkbox" className='form-check-input me-2 mb-3' id='checkReportes'/>
                        <label htmlForfor="checkReportes" className='form-check-label'>Notificaciones de Reportes Semanales</label>
                      </div>
                      <div>
                        <input type="checkbox" className='form-check-input me-2 mb-3' id='checkUpdateInsumos'/>
                        <label htmlForfor="checkUpdateInsumos" className='form-check-label'>Notificaciones de Actualizaciones de Insumos</label>
                      </div>
                      <div>
                        <input type="checkbox" className='form-check-input me-2 mb-3' id='checkMinimo'
                          onChange={(event) => setNotificacionStock(event.target.checked)}/>
                        <label htmlForfor="checkMinimo" className='form-check-label'>Notificaciones de Stock Mínimo</label>
                      </div>
                      {notificacionStock &&
                        <div>
                          <label for="rangoNotif" className='form-label'>Notificación al faltar {valorRango} unidades para el stock minimo</label>
                          <input type="range" className='form-range' id='rangoNotif' min="0" max="500" step="10"
                            value={valorRango} onChange={(event) => setValorRango(event.target.value)}/>
                        </div>
                      }
                    </div>
                  }
                </div>
              </div>
            </form>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
              <button type="button" class="btn btn-primary">Guardar Cambios</button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
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
              
              <button className='btn btn-warning me-3' data-bs-toggle="modal" data-bs-target="#configModal">
                Configurar Notificaciones
              </button>

              <button className="btn btn-danger" onClick={cerrarSesion}>
                Cerrar Sesión
              </button>
            </>
          )}
        </div>
      </nav>
      {dibujarConfigModal()}
    </>
  );
}

export default MainNav;
