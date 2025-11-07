import { Router } from 'express';
import {
  actualizarAlumno,
  crearAlumno,
  eliminarAlumno,
  listarAlumnos,
  obtenerAlumnoPorId
} from './alumno.controller.js';
import { validar } from '../../middlewares/validate.js';
import {
  esquemaActualizarAlumno,
  esquemaCrearAlumno,
  esquemaIdAlumno
} from './alumno.schema.js';

const enrutador = Router();

enrutador.get('/', listarAlumnos);
enrutador.post('/', validar(esquemaCrearAlumno), crearAlumno);
enrutador.get('/:AlumnoID', validar(esquemaIdAlumno, 'params'), obtenerAlumnoPorId);
enrutador.put(
  '/:AlumnoID',
  validar(esquemaIdAlumno, 'params'),
  validar(esquemaActualizarAlumno),
  actualizarAlumno
);
enrutador.delete('/:AlumnoID', validar(esquemaIdAlumno, 'params'), eliminarAlumno);

export default enrutador;
