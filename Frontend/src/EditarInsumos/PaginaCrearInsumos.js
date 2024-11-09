import React, { useState } from 'react';
import { Button, Form, Container, Card, ListGroup } from 'react-bootstrap';

const CrearInsumosPage = () => {
  
  const [nombre, setNombre] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [insumos, setInsumos] = useState([]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const nuevoInsumo = { nombre, cantidad, descripcion };
    setInsumos([...insumos, nuevoInsumo]);

    // Limpiar el formulario
    setNombre('');
    setCantidad('');
    setDescripcion('');
  };

  return (
  <Container className="d-flex flex-column align-items-center py-5">
  <h1 className="mb-4 text-center" style={{ color: '#333' }}>Crear Insumo</h1>

  <Form onSubmit={handleSubmit} style={{ maxWidth: '400px', width: '100%' }}>
    <Form.Group controlId="formNombre" className="mb-3">
      <Form.Label>Nombre del Insumo</Form.Label>
      <Form.Control
        type="text"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        required
        placeholder="Nombre del insumo"
      />
    </Form.Group>

    <Form.Group controlId="formCantidad" className="mb-3">
      <Form.Label>Cantidad</Form.Label>
      <Form.Control
        type="number"
        value={cantidad}
        onChange={(e) => setCantidad(e.target.value)}
        required
        placeholder="Cantidad disponible"
      />
    </Form.Group>

    <Form.Group controlId="formDescripcion" className="mb-3">
      <Form.Label>Descripción</Form.Label>
      <Form.Control
        as="textarea"
        value={descripcion}
        onChange={(e) => setDescripcion(e.target.value)}
        rows={3}
        placeholder="Descripción del insumo"
      />
    </Form.Group>

    <Button variant="success" type="submit" className="w-100">
      Crear Insumo
    </Button>
  </Form>

  <h2 className="mt-5">Lista de Insumos</h2>
  <div style={{ width: '100%', maxWidth: '500px' }}>
    <Card className="mt-4">
      <Card.Body>
        <ListGroup>
          {insumos.map((insumo, index) => (
            <ListGroup.Item key={index} className="mb-2">
              <strong>Nombre:</strong> {insumo.nombre} <br />
              <strong>Cantidad:</strong> {insumo.cantidad} <br />
              <strong>Descripción:</strong> {insumo.descripcion || 'N/A'}
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Card.Body>
    </Card>
  </div>
</Container>
);
}

export default CrearInsumosPage