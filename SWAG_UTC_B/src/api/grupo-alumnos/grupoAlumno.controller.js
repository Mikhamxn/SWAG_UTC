import { GrupoAlumno } from './grupoAlumno.model.js';
import { Grupo } from '../grupos/grupo.model.js';
import { Alumno } from '../alumnos/alumno.model.js';
import { manejadorAsincrono } from '../../utils/asyncHandler.js';
import { registro } from '../../utils/registro.js';

const incluirCatalogos = [
  {
    model: Grupo,
    as: 'Grupo',
    attributes: ['GrupoID', 'Nombre', 'Clave', 'Turno'],
    include: [
      {
        association: 'Carrera'
      }
    ]
  },
  {
    model: Alumno,
    as: 'Alumno',
    attributes: ['AlumnoID', 'Nombre', 'Apellido', 'Email']
  }
];

const cargarAsignacion = (criterio) =>
  GrupoAlumno.findOne({
    where: criterio,
    include: incluirCatalogos
  });

const validarCatalogos = async ({ GrupoID, AlumnoID }) => {
  const [grupo, alumno] = await Promise.all([
    Grupo.findByPk(GrupoID),
    Alumno.findByPk(AlumnoID)
  ]);

  if (!grupo) {
    return {
      valido: false,
      respuesta: {
        codigo: 404,
        cuerpo: {
          error: 'GrupoNoEncontrado',
          mensaje: `No existe el grupo con identificador ${GrupoID}.`
        }
      }
    };
  }

  if (!alumno) {
    return {
      valido: false,
      respuesta: {
        codigo: 404,
        cuerpo: {
          error: 'AlumnoNoEncontrado',
          mensaje: `No existe el alumno con identificador ${AlumnoID}.`
        }
      }
    };
  }

  return { valido: true };
};

export const asignarAlumnoAGrupo = manejadorAsincrono(async (req, res) => {
  const { GrupoID, AlumnoID, Activo = true } = req.body;

  const validacion = await validarCatalogos({ GrupoID, AlumnoID });
  if (!validacion.valido) {
    res.status(validacion.respuesta.codigo).json(validacion.respuesta.cuerpo);
    return;
  }

  const existente = await GrupoAlumno.findOne({ where: { GrupoID, AlumnoID } });
  if (existente) {
    res.status(409).json({
      error: 'AsignacionDuplicada',
      mensaje: 'El alumno ya está asignado a este grupo.'
    });
    return;
  }

  const asignacion = await GrupoAlumno.create({ GrupoID, AlumnoID, Activo });
  const asignacionCompleta = await cargarAsignacion({ GrupoID, AlumnoID });
  registro.info(`Alumno ${AlumnoID} asignado al grupo ${GrupoID}`);
  res.status(201).json({
    mensaje: 'Alumno asignado correctamente al grupo.',
    datos: asignacionCompleta
  });
});

export const listarAsignacionesGrupoAlumno = manejadorAsincrono(async (req, res) => {
  const { GrupoID, AlumnoID, Activo } = req.query;
  const filtros = {};

  if (GrupoID !== undefined) {
    filtros.GrupoID = GrupoID;
  }

  if (AlumnoID !== undefined) {
    filtros.AlumnoID = AlumnoID;
  }

  if (Activo !== undefined) {
    filtros.Activo = Activo;
  }

  const asignaciones = await GrupoAlumno.findAll({
    where: filtros,
    include: incluirCatalogos,
    order: [
      ['GrupoID', 'ASC'],
      ['AlumnoID', 'ASC']
    ]
  });

  res.json({ datos: asignaciones });
});

export const obtenerAsignacionPorId = manejadorAsincrono(async (req, res) => {
  const { GrupoID, AlumnoID } = req.params;
  const asignacion = await cargarAsignacion({ GrupoID, AlumnoID });

  if (!asignacion) {
    res.status(404).json({
      error: 'AsignacionNoEncontrada',
      mensaje: `No existe la asignación para el grupo ${GrupoID} y alumno ${AlumnoID}.`
    });
    return;
  }

  res.json({ datos: asignacion });
});

export const actualizarAsignacionGrupoAlumno = manejadorAsincrono(async (req, res) => {
  const { GrupoID, AlumnoID } = req.params;
  const asignacion = await GrupoAlumno.findOne({ where: { GrupoID, AlumnoID } });

  if (!asignacion) {
    res.status(404).json({
      error: 'AsignacionNoEncontrada',
      mensaje: `No existe la asignación para el grupo ${GrupoID} y alumno ${AlumnoID}.`
    });
    return;
  }

  await asignacion.update(req.body);
  const asignacionActualizada = await cargarAsignacion({ GrupoID, AlumnoID });
  registro.info(`Asignación grupo ${GrupoID} - alumno ${AlumnoID} actualizada.`);
  res.json({
    mensaje: 'Asignación actualizada correctamente.',
    datos: asignacionActualizada
  });
});

export const eliminarAsignacionGrupoAlumno = manejadorAsincrono(async (req, res) => {
  const { GrupoID, AlumnoID } = req.params;
  const asignacion = await GrupoAlumno.findOne({ where: { GrupoID, AlumnoID } });

  if (!asignacion) {
    res.status(404).json({
      error: 'AsignacionNoEncontrada',
      mensaje: `No existe la asignación para el grupo ${GrupoID} y alumno ${AlumnoID}.`
    });
    return;
  }

  await asignacion.destroy();
  registro.info(`Asignación grupo ${GrupoID} - alumno ${AlumnoID} eliminada.`);
  res.status(204).send();
});

export default {
  asignarAlumnoAGrupo,
  listarAsignacionesGrupoAlumno,
  obtenerAsignacionPorId,
  actualizarAsignacionGrupoAlumno,
  eliminarAsignacionGrupoAlumno
};
