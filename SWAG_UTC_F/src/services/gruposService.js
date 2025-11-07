import axios from "axios";

const URL_BASE = import.meta.env.VITE_API_URL?.replace(/\/$/, "") || "http://localhost:3000/api";

export const obtenerGrupos = async () => {
  const respuesta = await axios.get(`${URL_BASE}/grupos`, { withCredentials: true });
  return respuesta.data;
};

export const crearGrupo = async (grupo) => {
  const respuesta = await axios.post(`${URL_BASE}/grupos`, grupo, {
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
  });
  return respuesta.data;
};

export const actualizarGrupo = async (grupoId, grupo) => {
  const respuesta = await axios.put(`${URL_BASE}/grupos/${grupoId}`, grupo, {
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
  });
  return respuesta.data;
};

export const eliminarGrupo = async (grupoId) => {
  await axios.delete(`${URL_BASE}/grupos/${grupoId}`, { withCredentials: true });
  return true;
};
