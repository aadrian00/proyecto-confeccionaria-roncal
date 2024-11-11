import React, { useState, useEffect } from 'react';
import { Button, Form, Container, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const CrearInsumosPage = () => {
  const [nombre, setNombre] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [insumos, setInsumos] = useState([]);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  // Cargar insumos desde la API al montar el componente
  useEffect(() => {
    const fetchInsumos = async () => {
      try {
        const response = await fetch('https://5e50945f-fba5-4019-902c-bd5e2cfa4312.mock.pstmn.io/insumos');
        const result = await response.json();
        console.log(result.data[0].id);
        setInsumos(result.data); // Asumiendo que los insumos están en el campo 'data'
      } catch (error) {
        console.error('Error al cargar los insumos:', error);
      }
    };

    fetchInsumos();
  }, []);

  // Manejar la creación de un nuevo insumo
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch('https://5e50945f-fba5-4019-902c-bd5e2cfa4312.mock.pstmn.io/LlamadaInsumosExistentes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, cantidad, descripcion }),
      });

      if (response.ok) {
        const nuevoInsumo = await response.json();
        setInsumos([...insumos, nuevoInsumo.data]); // Añadir nuevo insumo a la lista
        setMessage('Insumo creado con éxito.');
        setNombre('');
        setCantidad('');
        setDescripcion('');
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
    <Container className="mt-5">
      <h2 className="text-center mb-4">Crear Insumo</h2>

      {message && <Alert variant="info">{message}</Alert>}

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

        <Form.Group className="mb-3" controlId="cantidad">
          <Form.Label>Cantidad</Form.Label>
          <Form.Control
            type="number"
            value={cantidad}
            onChange={(e) => setCantidad(e.target.value)}
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

        <Button variant="primary" type="submit" className="w-100">
          Crear Insumo
        </Button>
      </Form>

      <h3 className="text-center mt-5">Lista de Insumos</h3>

      {
      insumos.map((insumo) => (
        <div key={insumo.id} className="p-3 mb-2 border rounded d-flex justify-content-between align-items-center">
          <div>
            <strong>Nombre:</strong> {insumo.nombre} <br />
            <strong>Cantidad:</strong> {insumo.cantidad} <br />
            <strong>Descripción:</strong> {insumo.descripcion || 'N/A'}
          </div>
          <div>
            <Button variant="warning" onClick={() => handleEdit(insumo.id)} className="me-2">
              Editar
            </Button>
            <Button variant="danger" onClick={() => handleDelete(insumo.id)}>
              Eliminar
            </Button>
          </div>
        </div>
      ))}
    </Container>
  );
};

export default CrearInsumosPage;
