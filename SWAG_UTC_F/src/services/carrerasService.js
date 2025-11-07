import axios from "axios";

const URL_BASE = import.meta.env.VITE_API_URL?.replace(/\/$/, "") || "http://localhost:3000/api";

export const obtenerCarreras = async () => {
  const respuesta = await axios.get(`${URL_BASE}/carreras`, { withCredentials: true });
  return respuesta.data;
};

export const crearCarrera = async (carrera) => {
  const respuesta = await axios.post(`${URL_BASE}/carreras`, carrera, {
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
  });
  return respuesta.data;
};

export const actualizarCarrera = async (carreraId, carrera) => {
  const respuesta = await axios.put(`${URL_BASE}/carreras/${carreraId}`, carrera, {
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
  });
  return respuesta.data;
};

export const eliminarCarrera = async (carreraId) => {
  await axios.delete(`${URL_BASE}/carreras/${carreraId}`, { withCredentials: true });
  return true;
};
