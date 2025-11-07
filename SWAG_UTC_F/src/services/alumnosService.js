import axios from "axios";

const URL_BASE = import.meta.env.VITE_API_URL?.replace(/\/$/, "") || "http://localhost:3000/api";

export const obtenerAlumnos = async () => {
  const respuesta = await axios.get(`${URL_BASE}/alumnos`, { withCredentials: true });
  return respuesta.data;
};

export const crearAlumno = async (alumno) => {
  const respuesta = await axios.post(`${URL_BASE}/alumnos`, alumno, {
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
  });
  return respuesta.data;
};

export const actualizarAlumno = async (alumnoId, alumno) => {
  const respuesta = await axios.put(`${URL_BASE}/alumnos/${alumnoId}`, alumno, {
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
  });
  return respuesta.data;
};

export const eliminarAlumno = async (alumnoId) => {
  await axios.delete(`${URL_BASE}/alumnos/${alumnoId}`, { withCredentials: true });
  return true;
};
