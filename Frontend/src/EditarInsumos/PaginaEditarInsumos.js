import React, { useState, useEffect } from 'react';
import { Button, Form, Container, Alert } from 'react-bootstrap';
import { useParams } from 'react-router-dom';

const EditarInsumoPage = () => {
  const { id } = useParams(); // Obtener el ID del insumo desde la URL
  const [nombre, setNombre] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });

  // Cargar datos del insumo al montar el componente
  useEffect(() => {
    const fetchInsumo = async () => {
      try {
        const response = await fetch(`https://5e50945f-fba5-4019-902c-bd5e2cfa4312.mock.pstmn.io/insumos/${id}`);
        const result = await response.json();
        console.log(result);
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
    try {
      const response = await fetch(`https://mi-api.com/api/insumos/${id}`, {
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
          Guardar Cambios
        </Button>
      </Form>
    </Container>
  );
};

export default EditarInsumoPage;
