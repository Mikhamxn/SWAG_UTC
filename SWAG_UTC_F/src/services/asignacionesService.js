import axios from "axios";

const URL_BASE = import.meta.env.VITE_API_URL?.replace(/\/$/, "") || "http://localhost:3000/api";

export const obtenerAsignaciones = async () => {
  const respuesta = await axios.get(`${URL_BASE}/asignaciones`, { withCredentials: true });
  return respuesta.data;
};

export const crearAsignacion = async (asignacion) => {
  const respuesta = await axios.post(`${URL_BASE}/asignaciones`, asignacion, {
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
  });
  return respuesta.data;
};

export const actualizarAsignacion = async (horarioId, asignacion) => {
  const respuesta = await axios.put(`${URL_BASE}/asignaciones/${horarioId}`, asignacion, {
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
  });
  return respuesta.data;
};

export const eliminarAsignacion = async (horarioId) => {
  await axios.delete(`${URL_BASE}/asignaciones/${horarioId}`, { withCredentials: true });
  return true;
};
