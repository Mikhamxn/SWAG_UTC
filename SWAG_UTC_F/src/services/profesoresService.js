import axios from "axios";

const URL_BASE = import.meta.env.VITE_API_URL?.replace(/\/$/, "") || "http://localhost:3000/api";

export const obtenerProfesores = async () => {
  const respuesta = await axios.get(`${URL_BASE}/profesores`, { withCredentials: true });
  return respuesta.data;
};

export const crearProfesor = async (profesor) => {
  const respuesta = await axios.post(`${URL_BASE}/profesores`, profesor, {
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
  });
  return respuesta.data;
};

export const actualizarProfesor = async (profesorId, profesor) => {
  const respuesta = await axios.put(`${URL_BASE}/profesores/${profesorId}`, profesor, {
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
  });
  return respuesta.data;
};

export const eliminarProfesor = async (profesorId) => {
  await axios.delete(`${URL_BASE}/profesores/${profesorId}`, { withCredentials: true });
  return true;
};
