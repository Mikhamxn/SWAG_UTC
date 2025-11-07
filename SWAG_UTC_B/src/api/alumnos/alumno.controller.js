import { Alumno } from './alumno.model.js';
import { manejadorAsincrono } from '../../utils/asyncHandler.js';
import { registro } from '../../utils/registro.js';

export const crearAlumno = manejadorAsincrono(async (req, res) => {
  const alumno = await Alumno.create(req.body);
  registro.info(`Alumno creado con identificador ${alumno.AlumnoID}`);
  res.status(201).json({
    mensaje: 'Alumno creado correctamente.',
    datos: alumno
  });
});

export const listarAlumnos = manejadorAsincrono(async (req, res) => {
  const alumnos = await Alumno.findAll({ order: [['AlumnoID', 'ASC']] });
  res.json({ datos: alumnos });
});

export const obtenerAlumnoPorId = manejadorAsincrono(async (req, res) => {
  const { AlumnoID } = req.params;
  const alumno = await Alumno.findByPk(AlumnoID);

  if (!alumno) {
    res.status(404).json({
      error: 'NoEncontrado',
      mensaje: `No existe el alumno con identificador ${AlumnoID}.`
    });
    return;
  }

  res.json({ datos: alumno });
});

export const actualizarAlumno = manejadorAsincrono(async (req, res) => {
  const { AlumnoID } = req.params;
  const alumno = await Alumno.findByPk(AlumnoID);

  if (!alumno) {
    res.status(404).json({
      error: 'NoEncontrado',
      mensaje: `No existe el alumno con identificador ${AlumnoID}.`
    });
    return;
  }

  await alumno.update(req.body);
  registro.info(`Alumno actualizado con identificador ${AlumnoID}`);

  res.json({
    mensaje: 'Alumno actualizado correctamente.',
    datos: alumno
  });
});

export const eliminarAlumno = manejadorAsincrono(async (req, res) => {
  const { AlumnoID } = req.params;
  const alumno = await Alumno.findByPk(AlumnoID);

  if (!alumno) {
    res.status(404).json({
      error: 'NoEncontrado',
      mensaje: `No existe el alumno con identificador ${AlumnoID}.`
    });
    return;
  }

  await alumno.destroy();
  registro.info(`Alumno eliminado con identificador ${AlumnoID}`);

  res.status(204).send();
});

export default {
  crearAlumno,
  listarAlumnos,
  obtenerAlumnoPorId,
  actualizarAlumno,
  eliminarAlumno
};
