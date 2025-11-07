import axios from "axios";

const URL_BASE = import.meta.env.VITE_API_URL?.replace(/\/$/, "") || "http://localhost:3000/api";

export const obtenerGrupoAlumnos = async (params = {}) => {
  const respuesta = await axios.get(`${URL_BASE}/grupo-alumnos`, {
    params,
    withCredentials: true
  });
  return respuesta.data;
};

export const asignarAlumnoAGrupo = async (payload) => {
  const respuesta = await axios.post(`${URL_BASE}/grupo-alumnos`, payload, {
    withCredentials: true,
    headers: { "Content-Type": "application/json" }
  });
  return respuesta.data;
};

export const actualizarGrupoAlumno = async (grupoId, alumnoId, payload) => {
  const respuesta = await axios.put(`${URL_BASE}/grupo-alumnos/${grupoId}/${alumnoId}`, payload, {
    withCredentials: true,
    headers: { "Content-Type": "application/json" }
  });
  return respuesta.data;
};

export const eliminarGrupoAlumno = async (grupoId, alumnoId) => {
  await axios.delete(`${URL_BASE}/grupo-alumnos/${grupoId}/${alumnoId}`, {
    withCredentials: true
  });
  return true;
};
