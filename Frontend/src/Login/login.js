import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');  // Limpiar mensaje de error anterior

    try {
      // Enviar credenciales al backend para autenticación
      const response = await axios.post('http://localhost:5000/api/login', {
        username,
        password,
      });

      if (response.data.success) {
        // Si la autenticación es exitosa, almacenar el token
        localStorage.setItem('authToken', response.data.token);
        navigate('/inicio');
      } else {
        setErrorMessage('Usuario o contraseña incorrectos');
      }
    } catch (error) {
      console.error('Error durante la autenticación', error);
      setErrorMessage('Hubo un error al autenticar. Intenta nuevamente.');
    }
  };

  /*const handleGoogleLogin = async (response) => {
    try {
      const idToken = response.credential; // El idToken lo obtienes de la respuesta del login con Google

      console.log(idToken);

      // Enviar el idToken al backend para validarlo
      const res = await axios.post('http://localhost:5000/api/auth/google', { idToken });

      if (res.data.success) {
        // Si la autenticación es exitosa, almacenar el JWT en localStorage
        localStorage.setItem('authToken', res.data.token);

        // Redirigir al usuario a la página de inicio
        window.location.href = '/inicio'; // O usa 'navigate' si estás usando React Router
      } else {
        console.error('Error en login con Google:', res.data.message);
      }
    } catch (error) {
      console.error('Error durante la autenticación con Google:', error);
    }
  };*/

  const onClick = async () => {
      window.location.href = 'http://localhost:5000/login-google';
  };

  const handleFailure = (error) => {
    console.error("Login failed:", error);
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <form onSubmit={handleSubmit} className="p-4 border rounded shadow-sm bg-white" style={{ width: '300px' }}>
        <h2 className="text-center mb-4">Login</h2>
        {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}  {/* Mostrar mensaje de error */}
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
        <button type="submit" className="btn btn-success w-100">Iniciar Sesión</button>
        <div className="text-center mt-4">
          <button className='btn btn-warning w-100' onClick={onClick}>
            Iniciar Sesión con Google
          </button>
        </div>
      </form>
    </div>
  );
}

export default Login;
