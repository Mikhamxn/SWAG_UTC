import axios from "axios";

const URL_BASE = import.meta.env.VITE_API_URL?.replace(/\/$/, "") || "http://localhost:3000/api";

export const crearMateria = async (materia) => {
  const respuesta = await axios.post(`${URL_BASE}/materias`, materia, {
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
  });
  return respuesta.data;
};

export const obtenerMaterias = async () => {
  const respuesta = await axios.get(`${URL_BASE}/materias`, {
    withCredentials: true,
  });
  return respuesta.data;
};

export const actualizarMateria = async (materiaId, materia) => {
  const respuesta = await axios.put(`${URL_BASE}/materias/${materiaId}`, materia, {
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
  });
  return respuesta.data;
};

export const eliminarMateria = async (materiaId) => {
  await axios.delete(`${URL_BASE}/materias/${materiaId}`, {
    withCredentials: true,
  });
  return true;
};
