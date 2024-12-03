import React, { useState, useEffect } from 'react';
import { Button, Form, Container, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import ConfirmModal from '../Components/ConfirmacionModal.component'; // Importar el modal
import { jwtDecode as jwt_decode } from 'jwt-decode';


const CrearInsumosPage = () => {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [stock_actual, setStockActual] = useState('');
  const [stock_minimo, setStockMinimo] = useState('');
  const [insumos, setInsumos] = useState([]);
  const [message, setMessage] = useState('');
  const [showModal, setShowModal] = useState(false); // Estado para controlar el modal
  const navigate = useNavigate();


  // Cargar insumos desde la API al montar el componente
  useEffect(() => {
    const fetchInsumos = async () => {
      let email = localStorage.getItem('email'); // El email también debe estar guardado
      console.log(email);
      try {
        const response = await fetch('http://localhost:5000/api/insumos')
        const result = await response.json();
        setInsumos(result); // Asumiendo que los insumos están en el campo 'insumos'
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
      const response = await fetch('http://localhost:5000/api/insumos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'         },
        body: JSON.stringify({ nombre_insumo, descripcion, stock_actual, stock_minimo, email }),
      });

      if (response.ok) {
        setNombre('');
        setDescripcion('');
        setStockActual('');
        setStockMinimo('');
        setMessage('Insumo creado con éxito.');

        // Actualiza la lista de insumos recargando la data
        const updatedInsumos = await response.json();
        console.log("Esta es la respuesta que me está dando", updatedInsumos);
        setInsumos(prevInsumos => [...prevInsumos, updatedInsumos.insumo]);  // Recargar la lista de insumos desde la API
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
    try {
      const response = await fetch(`http://localhost:5000/api/insumos/${id}`, {
        method: 'DELETE',
        body: JSON.stringify({ email: email }),
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
    <Container className="mt-5">
      <h2 className="text-center mb-4">Crear Insumo</h2>

      {message && <Alert variant="info">{message}</Alert>}

      <Form onSubmit={handleShowModal}>
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

        <Form.Group className="mb-3" controlId="cantidad">
          <Form.Label>Stock Actual</Form.Label>
          <Form.Control
            type="number"
            value={stock_actual}
            onChange={(e) => setStockActual(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="cantidad">
          <Form.Label>Stock Mínimo</Form.Label>
          <Form.Control
            type="number"
            value={stock_minimo}
            onChange={(e) => setStockMinimo(e.target.value)}
            required
          />
        </Form.Group>

        <Button variant="primary" type="submit" className="w-100">
          Crear Insumo
        </Button>
      </Form>

      <h3 className="text-center mt-5">Lista de Insumos</h3>

      {insumos.map((insumo) => (
        <div key={insumo.id_insumo} className="p-3 mb-2 border rounded d-flex justify-content-between align-items-center">
          <div>
            <strong>Nombre:</strong> {insumo.nombre_insumo} <br />
            <strong>Descripción:</strong> {insumo.descripcion || 'N/A'} <br />
            <strong>Stock Actual:</strong> {insumo.stock_actual} <br />
            <strong>Stock Minimo:</strong> {insumo.stock_minimo} <br />

          </div>
          <div>
            <Button variant="warning" onClick={() => handleEdit(insumo.id_insumo)} className="me-2">
              Editar
            </Button>
            <Button variant="danger" onClick={() => handleDelete(insumo.id_insumo)}>
              Eliminar
            </Button>
          </div>
        </div>
      ))}

      <ConfirmModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        handleConfirm={confirmSubmit}
        title="Confirmación de Creación"
        bodyText="¿Está seguro de que desea crear este insumo?"
      />
    </Container>
  );
};

export default CrearInsumosPage;