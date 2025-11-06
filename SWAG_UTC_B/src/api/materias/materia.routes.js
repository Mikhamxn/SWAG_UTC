import { Router } from 'express';
import {
  actualizarMateria,
  crearMateria,
  eliminarMateria,
  listarMaterias,
  obtenerMateriaPorId
} from './materia.controller.js';
import { validar } from '../../middlewares/validate.js';
import {
  esquemaActualizarMateria,
  esquemaCrearMateria,
  esquemaIdMateria
} from './materia.schema.js';

const enrutador = Router();

enrutador.get('/', listarMaterias);
enrutador.post('/', validar(esquemaCrearMateria), crearMateria);
enrutador.get('/:intMateria', validar(esquemaIdMateria, 'params'), obtenerMateriaPorId);
enrutador.put(
  '/:intMateria',
  validar(esquemaIdMateria, 'params'),
  validar(esquemaActualizarMateria),
  actualizarMateria
);
enrutador.delete('/:intMateria', validar(esquemaIdMateria, 'params'), eliminarMateria);

export default enrutador;
