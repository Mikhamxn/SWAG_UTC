import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api/";

export const crearMateria = async (materia) => {
  try {
    const response = await axios.post(`${BASE_URL}Materias`, materia, {
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("El servidor respondió con:", error.response.data);
    }
    throw error;
  }
};

export const getMaterias = async () => {
  const response = await axios.get(`${BASE_URL}Materias`, {
    withCredentials: true,
  });
  return response.data;
};
