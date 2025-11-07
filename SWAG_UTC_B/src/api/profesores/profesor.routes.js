import { Router } from 'express';
import {
  actualizarProfesor,
  crearProfesor,
  eliminarProfesor,
  listarProfesores,
  obtenerProfesorPorId
} from './profesor.controller.js';
import { validar } from '../../middlewares/validate.js';
import {
  esquemaActualizarProfesor,
  esquemaCrearProfesor,
  esquemaIdProfesor
} from './profesor.schema.js';

const enrutador = Router();

enrutador.get('/', listarProfesores);
enrutador.post('/', validar(esquemaCrearProfesor), crearProfesor);
enrutador.get('/:ProfesorID', validar(esquemaIdProfesor, 'params'), obtenerProfesorPorId);
enrutador.put(
  '/:ProfesorID',
  validar(esquemaIdProfesor, 'params'),
  validar(esquemaActualizarProfesor),
  actualizarProfesor
);
enrutador.delete('/:ProfesorID', validar(esquemaIdProfesor, 'params'), eliminarProfesor);

export default enrutador;
