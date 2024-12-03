import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const CrearInsumosPage = () => {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [stock_actual, setStockActual] = useState('');
  const [stock_minimo, setStockMinimo] = useState('');
  const [insumos, setInsumos] = useState([]);
  const [message, setMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  // Cargar insumos desde la API al montar el componente
  useEffect(() => {
    const fetchInsumos = async () => {
      let email = localStorage.getItem('email'); // El email también debe estar guardado
      console.log(email);
      try {
        const response = await fetch('http://localhost:5000/Insumo')
        const result = await response.json();
        setInsumos(result.data); // Asumiendo que los insumos están en el campo 'insumos'
      } catch (error) {
        console.log("Se está llegando aquí");
        console.error('Error al cargar los insumos:', error);
      }
    };

    fetchInsumos();
  }, []);

  console.log(insumos);

  // Mostrar el modal antes de confirmar la creación
  const handleShowModal = (event) => {
    event.preventDefault();
    setShowModal(true);
  };

  // Confirmar y enviar los datos a la API
  const confirmSubmit = async () => {
    let email = localStorage.getItem('email'); // El email también debe estar guardado
    setShowModal(false);
    try {
      const nombre_insumo = nombre;
      console.log(nombre_insumo);
      const response = await fetch('http://localhost:5000/Insumo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'         },
        body: JSON.stringify({ nombre_insumo, descripcion, stock_actual, stock_minimo }),
      });

      if (response.ok) {
        setNombre('');
        setDescripcion('');
        setStockActual('');
        setStockMinimo('');
        setMessage('Insumo creado con éxito.');

        // Actualiza la lista de insumos recargando la data
        const updatedInsumos = { nombre_insumo, descripcion, stock_actual, stock_minimo };
        console.log(updatedInsumos);
        console.log("Esta es la respuesta que me está dando", updatedInsumos);
        setInsumos(prevInsumos => [...prevInsumos, updatedInsumos]);  // Recargar la lista de insumos desde la API
        console.log(insumos);
      } else {
        setMessage('Error al crear el insumo.');
      }
    } catch (error) {
      console.error('Error al crear el insumo:', error);
      setMessage('Error al crear el insumo.');
    }
  };

  // Manejar la eliminación de un insumo
  const handleDelete = async (id) => {
    let email = localStorage.getItem('email'); // El email también debe estar guardado
    console.log(email);
    try {
      const response = await fetch(`http://localhost:5000/Insumo/${id}`, {
        method: 'DELETE',
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        // Actualiza la lista de insumos después de eliminar uno
        setInsumos(insumos.filter((insumo) => insumo.id_insumo !== id));
        setMessage('Insumo eliminado con éxito.');
      } else {
        setMessage('Error al eliminar el insumo.');
      }
    } catch (error) {
      console.log(id);
      console.error('Error al eliminar el insumo:', error);
      setMessage('Error al eliminar el insumo.');
    }
  };

  // Redirigir a la página de edición de insumo
  const handleEdit = (id) => {
    navigate(`/editar-insumo/${id}`);
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Crear Insumo</h2>
      {message && <div className="alert alert-info">{message}</div>}

      <form onSubmit={handleShowModal}>
        <div className="mb-3">
          <label htmlFor="nombre" className="form-label">Nombre del Insumo</label>
          <input
            type="text"
            className="form-control"
            id="nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="descripcion" className="form-label">Descripción</label>
          <textarea
            className="form-control"
            id="descripcion"
            rows="3"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
          ></textarea>
        </div>
        <div className="mb-3">
          <label htmlFor="stock_actual" className="form-label">Stock Actual</label>
          <input
            type="number"
            min="0"
            className="form-control"
            id="stock_actual"
            value={stock_actual}
            onChange={(e) => setStockActual(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="stock_minimo" className="form-label">Stock Mínimo</label>
          <input
            type="number"
            min="0"
            className="form-control"
            id="stock_minimo"
            value={stock_minimo}
            onChange={(e) => setStockMinimo(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary w-100">Crear Insumo</button>
      </form>

      <h3 className="text-center mt-5">Lista de Insumos</h3>
      {insumos != null & insumos.length > 0 ? (
        insumos.map((insumo) => (
          <div key={insumo.id_insumo} className="border rounded p-3 mb-2 d-flex justify-content-between align-items-center">
            <div>
              <strong>Nombre:</strong> {insumo.nombre_insumo}<br />
              <strong>Descripción:</strong> {insumo.descripcion || 'N/A'}<br />
              <strong>Stock Actual:</strong> {insumo.stock_actual}<br />
              <strong>Stock Minimo:</strong> {insumo.stock_minimo}<br />
            </div>
            <div>
              <button className="btn btn-warning me-2" onClick={() => handleEdit(insumo.id_insumo)}>Editar</button>
              <button className="btn btn-danger" onClick={() => handleDelete(insumo.id_insumo)}>Eliminar</button>
            </div>
          </div>
        ))
      ) : (
        <div className="border rounded p-3 text-center bg-light text-danger">No hay insumos</div> // Si no hay insumos, mostrar este mensaje
      )}
      

      {showModal && (
        <div className="modal fade show d-block" tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirmación de Creación</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p>¿Está seguro de que desea crear este insumo?</p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={confirmSubmit}
                >
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CrearInsumosPage;
