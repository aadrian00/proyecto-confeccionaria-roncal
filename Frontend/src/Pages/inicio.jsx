import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";

function Inicio() {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/");
  };

  const listaOpciones = [
    { titulo: "Crear/Editar Insumos", descripcion: "Visualice los datos de los insumos actuales, cree y/o edite los necesarios", ruta: "/crearInsumo" },
    { titulo: "Visualizar Reporte Semanal", descripcion: "Vea el reporte de consumo de insumos de esta semana", ruta: "/reporte" },
    { titulo: "Visualizar histórico", descripcion: "Consulte los datos históricos del consumo de los insumos hasta la fecha actual", ruta: "/historico" },
  ];

  useEffect(() => {
    // Obtener los parámetros de la URL
    const params = new URLSearchParams(window.location.search);

    // Extraer el token
    const token = params.get('token');
    const email = params.get('email');

    if (token) {
      // Almacenar el token en localStorage
      localStorage.setItem('access_token', token);
      localStorage.setItem('email', email);
      console.log('Token guardado en localStorage:', token);

      // Opcional: redirigir a otra página una vez guardado el token
      window.location.href = '/inicio'; // Ajusta la ruta según tu app
    } else {
      console.log('No se encontró token en la URL.');
    }
  }, []);


  return (
    <div className="d-flex flex-column justify-content-center align-items-center mt-5">
      <h1>Bienvenido al sistema de registro de Insumos ¿Qué deseas realizar?</h1>
      <div className="row row-cols-3 g-5 mt-5">
        {listaOpciones.map((item, index) =>
          <div className="col" key={index}>
            <div className="card card-opcion h-100">
              <div className="card-body">
                <h5 className="card-title">{item.titulo}</h5>
                <p className="card-text">{item.descripcion}</p>
              </div>
              <div className="card-footer">
                <Link to={item.ruta} className="btn btn-primary">Ingresar</Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Inicio;

