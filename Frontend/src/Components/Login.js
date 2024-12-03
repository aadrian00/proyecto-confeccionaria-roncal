import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate(); // Hook para la navegación

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:5000/login", {
                email,
                contrasena: password, // Cambiado a "contrasena" sin la ñ
            });
            setMessage(`Bienvenido, ${response.data.nombre}`);
            // Navegar a la página de inicio después de autenticarse correctamente
            navigate("/inicio");
        } catch (error) {
            if (error.response) {
                setMessage(error.response.data.error);
            } else {
                setMessage("Error al conectar con el servidor");
            }
        }
    };

    const onClick = async () => {
        window.location.href = 'http://localhost:5000/login-google';
    };


    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-header text-center">
                            <h4>Inicio de Sesión</h4>
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">
                                        Correo Electrónico
                                    </label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        id="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="password" className="form-label">
                                        Contraseña
                                    </label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        id="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="d-grid">
                                    <button type="submit" className="btn btn-primary">
                                        Iniciar Sesión
                                    </button>
                                </div>
                                <div className="text-center mt-4">
                                <button onClick={onClick}>
                                    Iniciar Sesión con Google
                                </button>
                                </div>
                            </form>
                            {message && (
                                <div className="mt-3 alert alert-info text-center">
                                    {message}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
