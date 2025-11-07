import { Profesor } from './profesor.model.js';
import { manejadorAsincrono } from '../../utils/asyncHandler.js';
import { registro } from '../../utils/registro.js';

export const crearProfesor = manejadorAsincrono(async (req, res) => {
  const profesor = await Profesor.create(req.body);
  registro.info(`Profesor creado con identificador ${profesor.ProfesorID}`);
  res.status(201).json({
    mensaje: 'Profesor creado correctamente.',
    datos: profesor
  });
});

export const listarProfesores = manejadorAsincrono(async (req, res) => {
  const profesores = await Profesor.findAll({ order: [['ProfesorID', 'ASC']] });
  res.json({ datos: profesores });
});

export const obtenerProfesorPorId = manejadorAsincrono(async (req, res) => {
  const { ProfesorID } = req.params;
  const profesor = await Profesor.findByPk(ProfesorID);

  if (!profesor) {
    res.status(404).json({
      error: 'NoEncontrado',
      mensaje: `No existe el profesor con identificador ${ProfesorID}.`
    });
    return;
  }

  res.json({ datos: profesor });
});

export const actualizarProfesor = manejadorAsincrono(async (req, res) => {
  const { ProfesorID } = req.params;
  const profesor = await Profesor.findByPk(ProfesorID);

  if (!profesor) {
    res.status(404).json({
      error: 'NoEncontrado',
      mensaje: `No existe el profesor con identificador ${ProfesorID}.`
    });
    return;
  }

  await profesor.update(req.body);
  registro.info(`Profesor actualizado con identificador ${ProfesorID}`);

  res.json({
    mensaje: 'Profesor actualizado correctamente.',
    datos: profesor
  });
});

export const eliminarProfesor = manejadorAsincrono(async (req, res) => {
  const { ProfesorID } = req.params;
  const profesor = await Profesor.findByPk(ProfesorID);

  if (!profesor) {
    res.status(404).json({
      error: 'NoEncontrado',
      mensaje: `No existe el profesor con identificador ${ProfesorID}.`
    });
    return;
  }

  await profesor.destroy();
  registro.info(`Profesor eliminado con identificador ${ProfesorID}`);

  res.status(204).send();
});

export default {
  crearProfesor,
  listarProfesores,
  obtenerProfesorPorId,
  actualizarProfesor,
  eliminarProfesor
};
