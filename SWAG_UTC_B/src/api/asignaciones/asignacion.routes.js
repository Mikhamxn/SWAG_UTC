import { Router } from 'express';
import {
  actualizarAsignacion,
  crearAsignacion,
  eliminarAsignacion,
  listarAsignaciones,
  obtenerAsignacionPorId
} from './asignacion.controller.js';
import { validar } from '../../middlewares/validate.js';
import {
  esquemaActualizarAsignacion,
  esquemaCrearAsignacion,
  esquemaIdAsignacion
} from './asignacion.schema.js';

const enrutador = Router();

enrutador.get('/', listarAsignaciones);
enrutador.post('/', validar(esquemaCrearAsignacion), crearAsignacion);
enrutador.get('/:HorarioID', validar(esquemaIdAsignacion, 'params'), obtenerAsignacionPorId);
enrutador.put(
  '/:HorarioID',
  validar(esquemaIdAsignacion, 'params'),
  validar(esquemaActualizarAsignacion),
  actualizarAsignacion
);
enrutador.delete('/:HorarioID', validar(esquemaIdAsignacion, 'params'), eliminarAsignacion);

export default enrutador;
