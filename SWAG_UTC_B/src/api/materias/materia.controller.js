import { Materia } from './materia.model.js';
import { manejadorAsincrono } from '../../utils/asyncHandler.js';
import { registro } from '../../utils/registro.js';

export const crearMateria = manejadorAsincrono(async (req, res) => {
  const materia = await Materia.create(req.body);
  registro.info(`Materia creada con identificador ${materia.MateriaID}`);
  res.status(201).json({
    mensaje: 'Materia creada correctamente.',
    datos: materia
  });
});

export const listarMaterias = manejadorAsincrono(async (req, res) => {
  const materias = await Materia.findAll({ order: [['MateriaID', 'ASC']] });
  res.json({ datos: materias });
});

export const obtenerMateriaPorId = manejadorAsincrono(async (req, res) => {
  const { MateriaID } = req.params;
  const materia = await Materia.findByPk(MateriaID);

  if (!materia) {
    res.status(404).json({
      error: 'NoEncontrado',
      mensaje: `No existe la materia con identificador ${MateriaID}.`
    });
    return;
  }

  res.json({ datos: materia });
});

export const actualizarMateria = manejadorAsincrono(async (req, res) => {
  const { MateriaID } = req.params;
  const materia = await Materia.findByPk(MateriaID);

  if (!materia) {
    res.status(404).json({
      error: 'NoEncontrado',
      mensaje: `No existe la materia con identificador ${MateriaID}.`
    });
    return;
  }

  await materia.update(req.body);
  registro.info(`Materia actualizada con identificador ${MateriaID}`);

  res.json({
    mensaje: 'Materia actualizada correctamente.',
    datos: materia
  });
});

export const eliminarMateria = manejadorAsincrono(async (req, res) => {
  const { MateriaID } = req.params;
  const materia = await Materia.findByPk(MateriaID);

  if (!materia) {
    res.status(404).json({
      error: 'NoEncontrado',
      mensaje: `No existe la materia con identificador ${MateriaID}.`
    });
    return;
  }

  await materia.destroy();
  registro.info(`Materia eliminada con identificador ${MateriaID}`);

  res.status(204).send();
});

export default {
  crearMateria,
  listarMaterias,
  obtenerMateriaPorId,
  actualizarMateria,
  eliminarMateria
};
