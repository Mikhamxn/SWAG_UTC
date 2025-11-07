import { Grupo } from './grupo.model.js';
import { Carrera } from '../carreras/carrera.model.js';
import { manejadorAsincrono } from '../../utils/asyncHandler.js';
import { registro } from '../../utils/registro.js';

const incluirCarrera = {
  model: Carrera,
  as: 'Carrera',
  attributes: ['CarreraID', 'Clave', 'Nombre']
};

const cargarGrupo = (id) => Grupo.findByPk(id, { include: [incluirCarrera] });

export const crearGrupo = manejadorAsincrono(async (req, res) => {
  const grupo = await Grupo.create(req.body);
  const grupoCompleto = await cargarGrupo(grupo.GrupoID);
  registro.info(`Grupo creado con identificador ${grupo.GrupoID}`);
  res.status(201).json({
    mensaje: 'Grupo creado correctamente.',
    datos: grupoCompleto
  });
});

export const listarGrupos = manejadorAsincrono(async (req, res) => {
  const grupos = await Grupo.findAll({
    include: [incluirCarrera],
    order: [['GrupoID', 'ASC']]
  });
  res.json({ datos: grupos });
});

export const obtenerGrupoPorId = manejadorAsincrono(async (req, res) => {
  const { GrupoID } = req.params;
  const grupo = await cargarGrupo(GrupoID);

  if (!grupo) {
    res.status(404).json({
      error: 'NoEncontrado',
      mensaje: `No existe el grupo con identificador ${GrupoID}.`
    });
    return;
  }

  res.json({ datos: grupo });
});

export const actualizarGrupo = manejadorAsincrono(async (req, res) => {
  const { GrupoID } = req.params;
  const grupo = await Grupo.findByPk(GrupoID);

  if (!grupo) {
    res.status(404).json({
      error: 'NoEncontrado',
      mensaje: `No existe el grupo con identificador ${GrupoID}.`
    });
    return;
  }

  await grupo.update(req.body);
  const grupoActualizado = await cargarGrupo(GrupoID);
  registro.info(`Grupo actualizado con identificador ${GrupoID}`);

  res.json({
    mensaje: 'Grupo actualizado correctamente.',
    datos: grupoActualizado
  });
});

export const eliminarGrupo = manejadorAsincrono(async (req, res) => {
  const { GrupoID } = req.params;
  const grupo = await Grupo.findByPk(GrupoID);

  if (!grupo) {
    res.status(404).json({
      error: 'NoEncontrado',
      mensaje: `No existe el grupo con identificador ${GrupoID}.`
    });
    return;
  }

  await grupo.destroy();
  registro.info(`Grupo eliminado con identificador ${GrupoID}`);

  res.status(204).send();
});

export default {
  crearGrupo,
  listarGrupos,
  obtenerGrupoPorId,
  actualizarGrupo,
  eliminarGrupo
};
