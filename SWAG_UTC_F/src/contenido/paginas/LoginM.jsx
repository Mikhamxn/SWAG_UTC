// src/contenido/paginas/LoginMaestro.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function LoginMaestro() {
  const navigate = useNavigate();
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");

  const manejarLogin = async (e) => {
    e && e.preventDefault();

    // Aquí va la llamada real a la API cuando la tengas.
    // Ejemplo simulado:
    if (!correo || !password) {
      setMensaje("Completa correo y contraseña");
      return;
    }

    // Simulación: aceptar cualquier credencial para pruebas
    const fakeResponse = { token: "fake-token", rol: "profesor" };
    localStorage.setItem("token", fakeResponse.token);
    localStorage.setItem("rol", "profesor");

    // Redirige al dashboard de profesor (asegúrate de tener esa ruta)
    navigate("/profesores/dashboard");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white shadow-lg rounded-xl p-8 w-96">
        <h1 className="text-2xl font-bold text-center mb-6">Inicio de Sesión - Profesor</h1>

        <form onSubmit={manejarLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Correo del profesor"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            className="w-full border rounded-lg p-2"
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded-lg p-2"
          />

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
          >
            Iniciar Sesión
          </button>
        </form>

        {mensaje && <p className="text-red-500 text-center mt-3">{mensaje}</p>}
      </div>
    </div>
  );
}

export default LoginMaestro;
