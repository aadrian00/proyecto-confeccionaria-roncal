import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const CrearInsumosPage = () => {
  const [nombre, setNombre] = useState('');
  const [id, setId] = useState();
  const [cantidad, setCantidad] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [insumos, setInsumos] = useState([]);
  const [message, setMessage] = useState('');
  const [showModal, setShowModal] = useState(false); // Estado para controlar el modal
  const navigate = useNavigate();

  // Cargar insumos desde la API al montar el componente
  useEffect(() => {
    const fetchInsumos = async () => {
      try {
        const response = await fetch('https://5e50945f-fba5-4019-902c-bd5e2cfa4312.mock.pstmn.io/insumos');
        const result = await response.json();
        setInsumos(result.data); // Asumiendo que los insumos están en el campo 'data'
      } catch (error) {
        console.error('Error al cargar los insumos:', error);
      }
    };

    fetchInsumos();
  }, []);

  // Mostrar el modal antes de confirmar la creación
  const handleShowModal = (event) => {
    event.preventDefault();
    setShowModal(true);
  };

  // Confirmar y enviar los datos a la API
  const confirmSubmit = async () => {
    setShowModal(false);
    try {
      setId(6);
      const response = await fetch('https://5e50945f-fba5-4019-902c-bd5e2cfa4312.mock.pstmn.io/LlamadaInsumosExistentes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, nombre, cantidad, descripcion }),
      });

      if (response.ok) {
        setNombre('');
        setCantidad('');
        setDescripcion('');
        setMessage('Insumo creado con éxito.');

         // Actualiza la lista de insumos recargando la data
        const fetchInsumos = async () => {
        const response = await fetch('https://5e50945f-fba5-4019-902c-bd5e2cfa4312.mock.pstmn.io/insumos');
        const result = await response.json();
        setInsumos(result.data);  // Recargar la lista de insumos desde la API
      };

      fetchInsumos();
    }
       else {
        setMessage('Error al crear el insumo.');
      }
    } catch (error) {
      console.error('Error al crear el insumo:', error);
      setMessage('Error al crear el insumo.');
    }
  };

  // Manejar la eliminación de un insumo
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`https://5e50945f-fba5-4019-902c-bd5e2cfa4312.mock.pstmn.io/insumos/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setInsumos(insumos.filter((insumo) => insumo.id !== id));
        setMessage('Insumo eliminado con éxito.');
      } else {
        setMessage('Error al eliminar el insumo.');
      }
    } catch (error) {
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

      {message && (
        <div className="alert alert-info" role="alert">
          {message}
        </div>
      )}

      <form onSubmit={handleShowModal}>
        <div className="mb-3">
          <label htmlFor="nombre" className="form-label">
            Nombre del Insumo
          </label>
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
          <label htmlFor="cantidad" className="form-label">
            Cantidad
          </label>
          <input
            type="number"
            className="form-control"
            id="cantidad"
            value={cantidad}
            onChange={(e) => setCantidad(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="descripcion" className="form-label">
            Descripción
          </label>
          <textarea
            className="form-control"
            id="descripcion"
            rows="3"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
          />
        </div>

        <button type="submit" className="btn btn-primary w-100">
          Crear Insumo
        </button>
      </form>

      <h3 className="text-center mt-5">Lista de Insumos</h3>

      {insumos.map((insumo) => (
        <div
          key={insumo.id}
          className="p-3 mb-2 border rounded d-flex justify-content-between align-items-center"
        >
          <div>
            <strong>Nombre:</strong> {insumo.nombre} <br />
            <strong>Cantidad:</strong> {insumo.cantidad} <br />
            <strong>Descripción:</strong> {insumo.descripcion || 'N/A'}
          </div>
          <div>
            <button
              className="btn btn-warning me-2"
              onClick={() => handleEdit(insumo.id)}
            >
              Editar
            </button>
            <button
              className="btn btn-danger"
              onClick={() => handleDelete(insumo.id)}
            >
              Eliminar
            </button>
          </div>
        </div>
      ))}

      <div
        className={`modal fade ${showModal ? "show" : ""}`}
        style={{ display: showModal ? "block" : "none" }}
        role="dialog"
      >
        <div className="modal-dialog" role="document">
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
    </div>
  );
};

export default CrearInsumosPage;