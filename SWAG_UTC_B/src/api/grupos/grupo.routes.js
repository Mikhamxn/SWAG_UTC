import { Router } from 'express';
import {
  crearGrupo,
  listarGrupos,
  obtenerGrupoPorId,
  actualizarGrupo,
  eliminarGrupo
} from './grupo.controller.js';
import { validar } from '../../middlewares/validate.js';
import {
  esquemaCrearGrupo,
  esquemaActualizarGrupo,
  esquemaIdGrupo
} from './grupo.schema.js';

const enrutador = Router();

enrutador.get('/', listarGrupos);
enrutador.post('/', validar(esquemaCrearGrupo), crearGrupo);
enrutador.get('/:GrupoID', validar(esquemaIdGrupo, 'params'), obtenerGrupoPorId);
enrutador.put(
  '/:GrupoID',
  validar(esquemaIdGrupo, 'params'),
  validar(esquemaActualizarGrupo),
  actualizarGrupo
);
enrutador.delete('/:GrupoID', validar(esquemaIdGrupo, 'params'), eliminarGrupo);

export default enrutador;
