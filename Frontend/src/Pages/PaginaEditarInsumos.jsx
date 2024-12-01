import React, { useState, useEffect } from 'react';
import { Button, Form, Container, Alert } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import ConfirmModal from '../Components/ConfirmacionModal.component'; // Importar el modal reutilizable

const EditarInsumoPage = () => {
  const { id } = useParams(); // Obtener el ID del insumo desde la URL
  const [nombre, setNombre] = useState('');
  const [stock_actual, setStockActual] = useState('');
  const [stock_minimo, setStockMinimo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });
  const [showModal, setShowModal] = useState(false); // Estado para controlar el modal

  // Cargar datos del insumo al montar el componente
  useEffect(() => {
    const fetchInsumo = async () => {
      try {
        const response = await fetch(`http://localhost:3001/Insumo/${id}`);
        const result = await response.json();
        if (result) {
          setNombre(result.nombre_insumo || '');
          setDescripcion(result.descripcion || '');
          setStockActual(result.stock_actual || '');
          setStockMinimo(result.stock_minimo || '');
        } else {
          console.error('El insumo no fue encontrado:', result);
          setMessage({ text: 'Error: El insumo no existe.', type: 'danger' });
        }
      } catch (error) {
        console.error('Error al cargar el insumo:', error);
        setMessage({ text: 'Error al cargar el insumo.', type: 'danger' });
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
      const response = await fetch(`http://localhost:3001/Insumo/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre_insumo, descripcion, stock_actual, stock_minimo }),
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
    <Container className="mt-5">
      <h2 className="text-center mb-4">Editar Insumo</h2>

      {message.text && <Alert variant={message.type}>{message.text}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="nombre">
          <Form.Label>Nombre del Insumo</Form.Label>
          <Form.Control
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="descripcion">
          <Form.Label>Descripción</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="stock_actual">
          <Form.Label>Stock Actual</Form.Label>
          <Form.Control
            type="number"
            value={stock_actual}
            onChange={(e) => setStockActual(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="stock_minimo">
          <Form.Label>Stock Mínimo</Form.Label>
          <Form.Control
            type="number"
            value={stock_minimo}
            onChange={(e) => setStockMinimo(e.target.value)}
            required
          />
        </Form.Group>

        <Button variant="primary" type="submit" className="w-100">
          Guardar Cambios
        </Button>
      </Form>

      {/* Usando el modal reutilizable */}
      <ConfirmModal
        show={showModal}
        handleClose={cancelUpdate}
        handleConfirm={confirmUpdate}
        title="Confirmar Actualización"
        bodyText="¿Estás seguro de que deseas guardar los cambios realizados en este insumo?"
      />
    </Container>
  );
};

export default EditarInsumoPage;
