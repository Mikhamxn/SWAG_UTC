import { Carrera } from './carrera.model.js';
import { manejadorAsincrono } from '../../utils/asyncHandler.js';
import { registro } from '../../utils/registro.js';

export const crearCarrera = manejadorAsincrono(async (req, res) => {
  const carrera = await Carrera.create(req.body);
  registro.info(`Carrera creada con identificador ${carrera.CarreraID}`);
  res.status(201).json({
    mensaje: 'Carrera creada correctamente.',
    datos: carrera
  });
});

export const listarCarreras = manejadorAsincrono(async (req, res) => {
  const carreras = await Carrera.findAll({ order: [['CarreraID', 'ASC']] });
  res.json({ datos: carreras });
});

export const obtenerCarreraPorId = manejadorAsincrono(async (req, res) => {
  const { CarreraID } = req.params;
  const carrera = await Carrera.findByPk(CarreraID);

  if (!carrera) {
    res.status(404).json({
      error: 'NoEncontrado',
      mensaje: `No existe la carrera con identificador ${CarreraID}.`
    });
    return;
  }

  res.json({ datos: carrera });
});

export const actualizarCarrera = manejadorAsincrono(async (req, res) => {
  const { CarreraID } = req.params;
  const carrera = await Carrera.findByPk(CarreraID);

  if (!carrera) {
    res.status(404).json({
      error: 'NoEncontrado',
      mensaje: `No existe la carrera con identificador ${CarreraID}.`
    });
    return;
  }

  await carrera.update(req.body);
  await carrera.reload();
  registro.info(`Carrera actualizada con identificador ${CarreraID}`);

  res.json({
    mensaje: 'Carrera actualizada correctamente.',
    datos: carrera
  });
});

export const eliminarCarrera = manejadorAsincrono(async (req, res) => {
  const { CarreraID } = req.params;
  const carrera = await Carrera.findByPk(CarreraID);

  if (!carrera) {
    res.status(404).json({
      error: 'NoEncontrado',
      mensaje: `No existe la carrera con identificador ${CarreraID}.`
    });
    return;
  }

  await carrera.destroy();
  registro.info(`Carrera eliminada con identificador ${CarreraID}`);

  res.status(204).send();
});

export default {
  crearCarrera,
  listarCarreras,
  obtenerCarreraPorId,
  actualizarCarrera,
  eliminarCarrera
};
