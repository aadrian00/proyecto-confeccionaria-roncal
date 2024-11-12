import { Link, useNavigate } from "react-router-dom";

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

  return (
    <div className="d-flex flex-column justify-content-center align-items-center mt-5">
      <h1>Bienvenido al sistema de registro de Insumos ¿Qué deserías realizar?</h1>
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
