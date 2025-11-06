import axios from "axios";

const URL_BASE = import.meta.env.VITE_API_URL?.replace(/\/$/, "") || "http://localhost:3000/api";

export const crearMateria = async (materia) => {
  try {
    const respuesta = await axios.post(`${URL_BASE}/materias`, materia, {
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
    });
    return respuesta.data;
  } catch (error) {
    if (error.response) {
      console.error("El servidor respondió con:", error.response.data);
    }
    throw error;
  }
};

export const obtenerMaterias = async () => {
  const respuesta = await axios.get(`${URL_BASE}/materias`, {
    withCredentials: true,
  });
  return respuesta.data;
};
