import { Router } from 'express';
import {
  asignarAlumnoAGrupo,
  listarAsignacionesGrupoAlumno,
  obtenerAsignacionPorId,
  actualizarAsignacionGrupoAlumno,
  eliminarAsignacionGrupoAlumno
} from './grupoAlumno.controller.js';
import { validar } from '../../middlewares/validate.js';
import {
  esquemaCrearGrupoAlumno,
  esquemaActualizarGrupoAlumno,
  esquemaIdentificadores,
  esquemaConsultaGrupoAlumno
} from './grupoAlumno.schema.js';

const enrutador = Router();

enrutador.get('/', validar(esquemaConsultaGrupoAlumno, 'query'), listarAsignacionesGrupoAlumno);
enrutador.post('/', validar(esquemaCrearGrupoAlumno), asignarAlumnoAGrupo);
enrutador.get(
  '/:GrupoID/:AlumnoID',
  validar(esquemaIdentificadores, 'params'),
  obtenerAsignacionPorId
);
enrutador.put(
  '/:GrupoID/:AlumnoID',
  validar(esquemaIdentificadores, 'params'),
  validar(esquemaActualizarGrupoAlumno),
  actualizarAsignacionGrupoAlumno
);
enrutador.delete(
  '/:GrupoID/:AlumnoID',
  validar(esquemaIdentificadores, 'params'),
  eliminarAsignacionGrupoAlumno
);

export default enrutador;
