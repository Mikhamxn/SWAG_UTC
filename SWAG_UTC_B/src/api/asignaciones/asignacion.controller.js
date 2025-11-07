import { Op } from 'sequelize';
import { Horario } from './asignacion.model.js';
import { Materia } from '../materias/materia.model.js';
import { Profesor } from '../profesores/profesor.model.js';
import { Grupo } from '../grupos/grupo.model.js';
import { Carrera } from '../carreras/carrera.model.js';
import { manejadorAsincrono } from '../../utils/asyncHandler.js';
import { registro } from '../../utils/registro.js';

const incluirCatalogos = [
  {
    model: Materia,
    as: 'Materia',
    attributes: ['MateriaID', 'Nombre']
  },
  {
    model: Profesor,
    as: 'Profesor',
    attributes: ['ProfesorID', 'Nombre', 'Apellido']
  },
  {
    model: Grupo,
    as: 'Grupo',
    attributes: ['GrupoID', 'Clave', 'Nombre', 'Turno'],
    include: [
      {
        model: Carrera,
        as: 'Carrera',
        attributes: ['CarreraID', 'Clave', 'Nombre']
      }
    ]
  }
];

const cargarConRelaciones = async (horarioId) =>
  Horario.findByPk(horarioId, { include: incluirCatalogos });

const parsearId = (valor) => {
  const id = Number(valor);
  return Number.isInteger(id) ? id : null;
};

const validarCatalogos = async ({ MateriaID, ProfesorID, GrupoID }) => {
  const [materia, profesor, grupo] = await Promise.all([
    Materia.findByPk(MateriaID),
    Profesor.findByPk(ProfesorID),
    Grupo.findByPk(GrupoID, {
      include: [
        {
          model: Carrera,
          as: 'Carrera'
        }
      ]
    })
  ]);

  if (!materia) {
    return {
      valido: false,
      respuesta: {
        codigo: 400,
        cuerpo: {
          error: 'DatoInvalido',
          mensaje: `No existe la materia con identificador ${MateriaID}.`
        }
      }
    };
  }

  if (!profesor) {
    return {
      valido: false,
      respuesta: {
        codigo: 400,
        cuerpo: {
          error: 'DatoInvalido',
          mensaje: `No existe el profesor con identificador ${ProfesorID}.`
        }
      }
    };
  }

  if (!grupo) {
    return {
      valido: false,
      respuesta: {
        codigo: 400,
        cuerpo: {
          error: 'DatoInvalido',
          mensaje: `No existe el grupo con identificador ${GrupoID}.`
        }
      }
    };
  }

  return { valido: true, materia, profesor, grupo };
};

const construirFiltroTraslape = ({ DiaSemana, HoraInicio, HoraFin, HorarioID }) => ({
  DiaSemana,
  [Op.and]: [
    { HoraInicio: { [Op.lt]: HoraFin } },
    { HoraFin: { [Op.gt]: HoraInicio } }
  ],
  ...(HorarioID ? { HorarioID: { [Op.ne]: HorarioID } } : {})
});

const verificarConflictos = async ({ GrupoID, ProfesorID, DiaSemana, HoraInicio, HoraFin, HorarioID }) => {
  const condicionTraslape = construirFiltroTraslape({ DiaSemana, HoraInicio, HoraFin, HorarioID });

  const conflictoGrupo = await Horario.findOne({
    where: {
      ...condicionTraslape,
      GrupoID
    }
  });

  if (conflictoGrupo) {
    return {
      valido: false,
      respuesta: {
        codigo: 409,
        cuerpo: {
          error: 'ConflictoHorario',
          mensaje: 'El grupo ya tiene un horario asignado en el mismo intervalo.'
        }
      }
    };
  }

  const conflictoProfesor = await Horario.findOne({
    where: {
      ...condicionTraslape,
      ProfesorID
    }
  });

  if (conflictoProfesor) {
    return {
      valido: false,
      respuesta: {
        codigo: 409,
        cuerpo: {
          error: 'ConflictoHorario',
          mensaje: 'El profesor ya tiene un horario asignado en el mismo intervalo.'
        }
      }
    };
  }

  return { valido: true };
};

export const crearAsignacion = manejadorAsincrono(async (req, res) => {
  const validacionCatalogos = await validarCatalogos(req.body);

  if (!validacionCatalogos.valido) {
    res.status(validacionCatalogos.respuesta.codigo).json(validacionCatalogos.respuesta.cuerpo);
    return;
  }

  const validacionConflictos = await verificarConflictos(req.body);

  if (!validacionConflictos.valido) {
    res.status(validacionConflictos.respuesta.codigo).json(validacionConflictos.respuesta.cuerpo);
    return;
  }

  const horario = await Horario.create(req.body);
  const horarioConRelaciones = await cargarConRelaciones(horario.HorarioID);
  registro.info(`Asignación creada con identificador ${horario.HorarioID}`);
  res.status(201).json({
    mensaje: 'Asignación creada correctamente.',
    datos: horarioConRelaciones
  });
});

export const listarAsignaciones = manejadorAsincrono(async (req, res) => {
  const horarios = await Horario.findAll({
    include: incluirCatalogos,
    order: [['HorarioID', 'ASC']]
  });
  res.json({ datos: horarios });
});

export const obtenerAsignacionPorId = manejadorAsincrono(async (req, res) => {
  const HorarioID = parsearId(req.params.HorarioID);

  if (HorarioID === null) {
    res.status(400).json({
      error: 'DatoInvalido',
      mensaje: 'El identificador del horario debe ser un número entero.'
    });
    return;
  }

  const horario = await Horario.findByPk(HorarioID, { include: incluirCatalogos });

  if (!horario) {
    res.status(404).json({
      error: 'NoEncontrado',
      mensaje: `No existe la asignación con identificador ${HorarioID}.`
    });
    return;
  }

  res.json({ datos: horario });
});

export const actualizarAsignacion = manejadorAsincrono(async (req, res) => {
  const HorarioID = parsearId(req.params.HorarioID);

  if (HorarioID === null) {
    res.status(400).json({
      error: 'DatoInvalido',
      mensaje: 'El identificador del horario debe ser un número entero.'
    });
    return;
  }

  const horario = await Horario.findByPk(HorarioID);

  if (!horario) {
    res.status(404).json({
      error: 'NoEncontrado',
      mensaje: `No existe la asignación con identificador ${HorarioID}.`
    });
    return;
  }

  const payloadActualizacion = { ...req.body };

  const validacionCatalogos = await validarCatalogos({
    MateriaID: payloadActualizacion.MateriaID ?? horario.MateriaID,
    ProfesorID: payloadActualizacion.ProfesorID ?? horario.ProfesorID,
    GrupoID: payloadActualizacion.GrupoID ?? horario.GrupoID
  });

  if (!validacionCatalogos.valido) {
    res.status(validacionCatalogos.respuesta.codigo).json(validacionCatalogos.respuesta.cuerpo);
    return;
  }

  const validacionConflictos = await verificarConflictos({
    MateriaID: payloadActualizacion.MateriaID ?? horario.MateriaID,
    ProfesorID: payloadActualizacion.ProfesorID ?? horario.ProfesorID,
    GrupoID: payloadActualizacion.GrupoID ?? horario.GrupoID,
    DiaSemana: payloadActualizacion.DiaSemana ?? horario.DiaSemana,
    HoraInicio: payloadActualizacion.HoraInicio ?? horario.HoraInicio,
    HoraFin: payloadActualizacion.HoraFin ?? horario.HoraFin,
    HorarioID
  });

  if (!validacionConflictos.valido) {
    res.status(validacionConflictos.respuesta.codigo).json(validacionConflictos.respuesta.cuerpo);
    return;
  }

  await horario.update(payloadActualizacion);
  const horarioConRelaciones = await cargarConRelaciones(HorarioID);
  registro.info(`Asignación actualizada con identificador ${HorarioID}`);

  res.json({
    mensaje: 'Asignación actualizada correctamente.',
    datos: horarioConRelaciones
  });
});

export const eliminarAsignacion = manejadorAsincrono(async (req, res) => {
  const HorarioID = parsearId(req.params.HorarioID);

  if (HorarioID === null) {
    res.status(400).json({
      error: 'DatoInvalido',
      mensaje: 'El identificador del horario debe ser un número entero.'
    });
    return;
  }

  const horario = await Horario.findByPk(HorarioID);

  if (!horario) {
    res.status(404).json({
      error: 'NoEncontrado',
      mensaje: `No existe la asignación con identificador ${HorarioID}.`
    });
    return;
  }

  await horario.destroy();
  registro.info(`Asignación eliminada con identificador ${HorarioID}`);

  res.status(204).send();
});

export default {
  crearAsignacion,
  listarAsignaciones,
  obtenerAsignacionPorId,
  actualizarAsignacion,
  eliminarAsignacion
};
