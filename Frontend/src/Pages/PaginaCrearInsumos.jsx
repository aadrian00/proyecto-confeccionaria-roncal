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

  useEffect(() => {
    const fetchInsumos = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/insumos');
        const result = await response.json();
        setInsumos(result);
      } catch (error) {
        console.error('Error al cargar los insumos:', error);
      }
    };

    fetchInsumos();
  }, []);

  const handleShowModal = (event) => {
    event.preventDefault();
    setShowModal(true);
  };

  const confirmSubmit = async () => {
    setShowModal(false);
    try {
      const response = await fetch('http://localhost:5000/api/insumos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, descripcion, stock_actual, stock_minimo }),
      });

      if (response.ok) {
        const updatedInsumos = await response.json();
        setInsumos((prevInsumos) => [...prevInsumos, updatedInsumos.insumo]);
        setMessage('Insumo creado con éxito.');
        setNombre('');
        setDescripcion('');
        setStockActual('');
        setStockMinimo('');
      } else {
        setMessage('Error al crear el insumo.');
      }
    } catch (error) {
      console.error('Error al crear el insumo:', error);
      setMessage('Error al crear el insumo.');
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/insumos/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setInsumos(insumos.filter((insumo) => insumo.id_insumo !== id));
        setMessage('Insumo eliminado con éxito.');
      } else {
        setMessage('Error al eliminar el insumo.');
      }
    } catch (error) {
      console.error('Error al eliminar el insumo:', error);
      setMessage('Error al eliminar el insumo.');
    }
  };

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
        <div className="border rounded p-3 text-center bg-light text-danger">Error al cargar los insumos</div>
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
