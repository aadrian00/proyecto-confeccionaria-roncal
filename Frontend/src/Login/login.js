import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username === 'abc' && password === '12345') {
      navigate('/inicio');
    } else {
      alert('Usuario o contraseña incorrectos');
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <form onSubmit={handleSubmit} className="p-4 border rounded shadow-sm bg-white" style={{ width: '300px' }}>
        <h2 className="text-center mb-4">Login</h2>
        <div className="mb-3">
          <label className="form-label">Usuario:</label>
          <input
            type="text"
            className="form-control"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Password:</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-success w-100">Login</button>
      </form>
    </div>
  );
}

export default Login;
