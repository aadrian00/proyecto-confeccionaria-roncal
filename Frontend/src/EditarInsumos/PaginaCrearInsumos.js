import React, { useState } from 'react';

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
      <div style={{ fontFamily: 'Arial, sans-serif', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px' }}>
        <h1 style={{ color: '#333' }}>Crear Insumo</h1>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', maxWidth: '300px', marginBottom: '20px' }}>
          <label>Nombre del Insumo:</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
            style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px', marginBottom: '10px' }}
          />
  
          <label>Cantidad:</label>
          <input
            type="number"
            value={cantidad}
            onChange={(e) => setCantidad(e.target.value)}
            required
            style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px', marginBottom: '10px' }}
          />
  
          <label>Descripción:</label>
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            rows="3"
            style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px', marginBottom: '10px' }}
          />
  
          <button type="submit" style={{ padding: '10px', color: '#fff', backgroundColor: '#28a745', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            Crear Insumo
          </button>
        </form>
  
        <h2>Lista de Insumos</h2>
        <div style={{ width: '100%', maxWidth: '500px' }}>
          {insumos.map((insumo, index) => (
            <div key={index} style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px', marginBottom: '10px', backgroundColor: '#f9f9f9' }}>
              <strong>Nombre:</strong> {insumo.nombre} <br />
              <strong>Cantidad:</strong> {insumo.cantidad} <br />
              <strong>Descripción:</strong> {insumo.descripcion || 'N/A'}
            </div>
          ))}
        </div>
      </div>
    );
}

export default CrearInsumosPage