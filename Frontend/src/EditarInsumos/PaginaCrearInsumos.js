import React, { useState, useEffect } from 'react';
import { Button, Form, Container, ListGroup } from 'react-bootstrap';

const CrearInsumosPage = () => {
  const [nombre, setNombre] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [insumos, setInsumos] = useState([]);

  // Cargar la lista de insumos desde la API
  const fetchInsumos = async () => {
    try {
      const response = await fetch('https://5e50945f-fba5-4019-902c-bd5e2cfa4312.mock.pstmn.io/insumos'); // Ruta de la API
      const result = await response.json();
      console.log(result.data);
      setInsumos(result.data || []);
    } catch (error) {
      console.error('Error al cargar los insumos:', error);
    }
  };

  // Enviar los datos del formulario a la API
  const handleSubmit = async (event) => {
    event.preventDefault();
    const nuevoInsumo = { nombre, cantidad, descripcion };
    try {
      const response = await fetch('https://5e50945f-fba5-4019-902c-bd5e2cfa4312.mock.pstmn.io/LlamadaInsumosExistentes', { // Ruta de la API
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(nuevoInsumo),
      });
      console.log(response.codigo);
      if (response.ok) {
        // Recargar los insumos después de agregar el nuevo
        fetchInsumos();
        // Limpiar el formulario
        setNombre('');
        setCantidad('');
        setDescripcion('');
      } else {
        console.error('Error al agregar el insumo');
      }
    } catch (error) {
      console.error('Error al enviar el insumo:', error);
    }
  };

  // Usar useEffect para cargar los insumos cuando la página se monte
  useEffect(() => {
    fetchInsumos();
  }, []);

  return (
    <Container style={{ fontFamily: 'Arial, sans-serif', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px' }}>
      <h1 style={{ color: '#333' }}>Crear Insumo</h1>

      <Form onSubmit={handleSubmit} style={{ maxWidth: '500px', width: '100%' }}>
        <Form.Group controlId="formNombre">
          <Form.Label style={{marginTop: '20px'}}>Nombre del Insumo</Form.Label>
          <Form.Control
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
            placeholder="Nombre del insumo"
          />
        </Form.Group>

        <Form.Group controlId="formCantidad">
          <Form.Label style={{marginTop: '20px'}}>Cantidad</Form.Label>
          <Form.Control
            type="number"
            value={cantidad}
            onChange={(e) => setCantidad(e.target.value)}
            required
            placeholder="Cantidad"
          />
        </Form.Group>

        <Form.Group controlId="formDescripcion">
          <Form.Label style={{marginTop: '20px'}}>Descripción</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            placeholder="Descripción"
          />
        </Form.Group>

        <Button variant="success" type="submit" style={{ width: '100%', marginTop: '20px' }}>
          Crear Insumo
        </Button>
      </Form>

      <h2 style={{marginTop: '20px' }}>Lista de Insumos</h2>
      <ListGroup style={{ width: '100%', maxWidth: '600px'}}>
        {insumos.length === 0 ? (
          <ListGroup.Item>No hay insumos registrados</ListGroup.Item>
        ) : (
          insumos.map((insumo, index) => (
            <ListGroup.Item key={index} style={{ marginBottom: '10px' }}>
              <strong>Nombre:</strong> {insumo.nombre} <br />
              <strong>Cantidad:</strong> {insumo.cantidad} <br />
              <strong>Descripción:</strong> {insumo.descripcion || 'N/A'}
            </ListGroup.Item>
          ))
        )}
      </ListGroup>
    </Container>
  );
};

export default CrearInsumosPage;