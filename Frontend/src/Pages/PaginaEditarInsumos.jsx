import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import ConfirmModal from '../Components/ConfirmacionModal.component'; // Mantener el modal reutilizable
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.js';

const EditarInsumoPage = () => {
  const { id } = useParams(); // Obtener el ID del insumo desde la URL
  const [nombre, setNombre] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [stock_actual, setStockActual] = useState('');
  const [stock_minimo, setStockMinimo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });
  const [showModal, setShowModal] = useState(false); // Estado para controlar el modal

  const token = localStorage.getItem('access_token');
  const email = localStorage.getItem('email');

  const navigate = useNavigate();

  // Cargar datos del insumo al montar el componente
  useEffect(() => {
    const fetchInsumo = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/insumos/${id}`);
        const result = await response.json();
        console.log(result);
        const insumo = result;
        setNombre(insumo.nombre_insumo);
        setDescripcion(insumo.descripcion);
        setStockActual(insumo.stock_actual);
        setStockMinimo(insumo.stock_minimo);
      } catch (error) {
        console.error('Error al cargar el insumo:', error);
      }
    };

    fetchInsumo();
  }, [id]);

  // Manejar la actualización del insumo
  const handleSubmit = (event) => {
    event.preventDefault();
    setShowModal(true); // Mostrar el modal de confirmación
  };

  // Confirmar la actualización
  const confirmUpdate = async () => {
    try {
      const nombre_insumo = nombre;
      const response = await fetch(`http://localhost:5000/api/insumos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre_insumo, descripcion, stock_actual, stock_minimo, email }),
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
    navigate('/crearInsumo');
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
            id="nombre"
            className="form-control"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="descripcion" className="form-label">
            Descripción
          </label>
          <textarea
            id="descripcion"
            className="form-control"
            rows="3"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
          ></textarea>
        </div>

        <div className="mb-3">
          <label htmlFor="stock_actual" className="form-label">
            Stock Actual
          </label>
          <input
            type="number"
            id="stock_actual"
            className="form-control"
            value={stock_actual}
            onChange={(e) => setStockActual(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="stock_minimo" className="form-label">
            Stock Mínimo
          </label>
          <input
            type="number"
            id="stock_minimo"
            className="form-control"
            value={stock_minimo}
            onChange={(e) => setStockMinimo(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary w-100">
          Guardar Cambios
        </button>
      </form>

      {/* Usando el modal reutilizable */}
      <ConfirmModal
        show={showModal}
        handleClose={cancelUpdate}
        handleConfirm={confirmUpdate}
        title="Confirmar Actualización"
        bodyText="¿Estás seguro de que deseas guardar los cambios realizados en este insumo?"
      />
    </div>
  );
};

export default EditarInsumoPage;