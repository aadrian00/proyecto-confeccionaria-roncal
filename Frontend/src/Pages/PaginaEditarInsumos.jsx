import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const EditarInsumoPage = () => {
  const { id } = useParams(); // Obtener el ID del insumo desde la URL
  const [nombre, setNombre] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });
  const [showModal, setShowModal] = useState(false); // Estado para controlar el modal

  // Cargar datos del insumo al montar el componente
  useEffect(() => {
    const fetchInsumo = async () => {
      try {
        const response = await fetch(`https://5e50945f-fba5-4019-902c-bd5e2cfa4312.mock.pstmn.io/insumos/${id}`);
        const result = await response.json();
        const insumo = result; // Suponiendo que los datos están en `data`
        setNombre(insumo.nombre);
        setCantidad(insumo.cantidad);
        setDescripcion(insumo.descripcion);
      } catch (error) {
        console.error('Error al cargar el insumo:', error);
      }
    };

    fetchInsumo();
  }, [id]);

  // Manejar la actualización del insumo
  const handleSubmit = async (event) => {
    event.preventDefault();
    setShowModal(true); // Mostrar el modal de confirmación
  };

  // Confirmar la actualización
  const confirmUpdate = async () => {
    try {
      const response = await fetch(`https://5e50945f-fba5-4019-902c-bd5e2cfa4312.mock.pstmn.io/insumos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, cantidad, descripcion }),
      });

      if (response.ok) {
        setMessage({ text: 'Insumo actualizado con éxito.', type: 'success' });
      } else {
        setMessage({ text: 'Error al actualizar el insumo.', type: 'danger' });
      }
    } catch (error) {
      console.error('Error al actualizar el insumo:', error);
      setMessage({ text: 'Error al actualizar el insumo.', type: 'danger' });
    }
    setShowModal(false); // Cerrar el modal después de la confirmación
  };

  // Cancelar la actualización
  const cancelUpdate = () => {
    setShowModal(false); // Cerrar el modal sin realizar cambios
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Editar Insumo</h2>

      {message.text && (
        <div className={`alert alert-${message.type}`} role="alert">
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit}>
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
          Guardar Cambios
        </button>
      </form>

      {/* Usando el modal reutilizable */}
      <div
        className={`modal fade ${showModal ? "show" : ""}`}
        style={{ display: showModal ? "block" : "none" }}
        role="dialog"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Confirmar Actualización</h5>
              <button type="button" className="btn-close" onClick={cancelUpdate}></button>
            </div>
            <div className="modal-body">
              <p>¿Estás seguro de que deseas guardar los cambios realizados en este insumo?</p>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={cancelUpdate}>
                Cancelar
              </button>
              <button type="button" className="btn btn-primary" onClick={confirmUpdate}>
                Confirmar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditarInsumoPage;

