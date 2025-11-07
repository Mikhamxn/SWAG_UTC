import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  const navigate = useNavigate();

  const manejarLogin = async (e) => {
    e.preventDefault();

    try {
      // Aquí pones tu URL real cuando tengas la API (por ejemplo: http://localhost:5000/api/loginA)
      const res = await fetch("/api/loginA", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo, password }),
      });

      if (!res.ok) throw new Error("Credenciales inválidas");
      const data = await res.json();

      localStorage.setItem("token", data.token);

      // Redirige al dashboard de alumnos
      window.location.href = "/alumnos/dashboard";
    } catch (err) {
      setMensaje(err.message);
    }
  };

  const irLoginMaestro = () => {
    navigate("/loginM"); // Redirige al login de maestro
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white shadow-lg rounded-xl p-8 w-96">
        <h1 className="text-2xl font-bold text-center mb-6">
          Inicio de Sesión - Alumnos
        </h1>

        <form onSubmit={manejarLogin}>
          <input
            type="email"
            placeholder="Correo"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            className="w-full border rounded-lg p-2 mb-4"
            required
          />

          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded-lg p-2 mb-4"
            required
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Iniciar Sesión
          </button>
        </form>

        <div className="mt-4"></div>

        <button
          onClick={irLoginMaestro}
          className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
        >
          Si eres maestro, pulsa aquí
        </button>

        {mensaje && (
          <p className="text-center text-red-500 mt-3 text-sm">{mensaje}</p>
        )}
      </div>
    </div>
  );
}

export default Login;
