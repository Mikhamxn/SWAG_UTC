import { Router } from 'express';
import {
  crearCarrera,
  listarCarreras,
  obtenerCarreraPorId,
  actualizarCarrera,
  eliminarCarrera
} from './carrera.controller.js';
import { validar } from '../../middlewares/validate.js';
import {
  esquemaCrearCarrera,
  esquemaActualizarCarrera,
  esquemaIdCarrera
} from './carrera.schema.js';

const enrutador = Router();

enrutador.get('/', listarCarreras);
enrutador.post('/', validar(esquemaCrearCarrera), crearCarrera);
enrutador.get('/:CarreraID', validar(esquemaIdCarrera, 'params'), obtenerCarreraPorId);
enrutador.put(
  '/:CarreraID',
  validar(esquemaIdCarrera, 'params'),
  validar(esquemaActualizarCarrera),
  actualizarCarrera
);
enrutador.delete('/:CarreraID', validar(esquemaIdCarrera, 'params'), eliminarCarrera);

export default enrutador;
