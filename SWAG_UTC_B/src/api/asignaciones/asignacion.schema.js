import { z } from 'zod';

const regexHora = /^([01]\d|2[0-3]):([0-5]\d)$/;

const esquemaBase = {
  MateriaID: z.coerce
    .number({ invalid_type_error: 'El campo MateriaID debe ser numérico.' })
    .int('El campo MateriaID debe ser un entero.')
    .positive('El campo MateriaID debe ser positivo.'),
  GrupoID: z.coerce
    .number({ invalid_type_error: 'El campo GrupoID debe ser numérico.' })
    .int('El campo GrupoID debe ser un entero.')
    .positive('El campo GrupoID debe ser positivo.'),
  ProfesorID: z.coerce
    .number({ invalid_type_error: 'El campo ProfesorID debe ser numérico.' })
    .int('El campo ProfesorID debe ser un entero.')
    .positive('El campo ProfesorID debe ser positivo.'),
  DiaSemana: z
    .string({ required_error: 'El campo DiaSemana es obligatorio.' })
    .trim()
    .min(3, 'El campo DiaSemana debe tener al menos 3 caracteres.')
    .max(10, 'El campo DiaSemana admite hasta 10 caracteres.'),
  HoraInicio: z
    .string({ required_error: 'El campo HoraInicio es obligatorio.' })
    .regex(regexHora, 'El campo HoraInicio debe tener el formato HH:mm.'),
  HoraFin: z
    .string({ required_error: 'El campo HoraFin es obligatorio.' })
    .regex(regexHora, 'El campo HoraFin debe tener el formato HH:mm.'),
  CodigoQRClase: z
    .string({ invalid_type_error: 'El campo CodigoQRClase debe ser texto.' })
    .trim()
    .max(100, 'El campo CodigoQRClase admite hasta 100 caracteres.')
    .optional(),
  Activo: z
    .boolean({ invalid_type_error: 'El campo Activo debe ser booleano.' })
    .optional()
    .default(true)
};

const validarRangoHorario = (datos) => {
  const [horaInicio, minutoInicio] = datos.HoraInicio.split(':').map(Number);
  const [horaFin, minutoFin] = datos.HoraFin.split(':').map(Number);
  const inicio = horaInicio * 60 + minutoInicio;
  const fin = horaFin * 60 + minutoFin;
  return fin > inicio;
};

export const esquemaCrearAsignacion = z
  .object(esquemaBase)
  .superRefine((datos, contexto) => {
    if (!validarRangoHorario(datos)) {
      contexto.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'HoraFin debe ser mayor que HoraInicio.',
        path: ['HoraFin']
      });
    }
  });

export const esquemaActualizarAsignacion = z
  .object({
    MateriaID: esquemaBase.MateriaID.optional(),
    GrupoID: esquemaBase.GrupoID.optional(),
    ProfesorID: esquemaBase.ProfesorID.optional(),
    DiaSemana: esquemaBase.DiaSemana.optional(),
    HoraInicio: esquemaBase.HoraInicio.optional(),
    HoraFin: esquemaBase.HoraFin.optional(),
    CodigoQRClase: esquemaBase.CodigoQRClase.optional(),
    Activo: esquemaBase.Activo.optional()
  })
  .superRefine((datos, contexto) => {
    if (datos.HoraInicio && datos.HoraFin) {
      if (!validarRangoHorario({ HoraInicio: datos.HoraInicio, HoraFin: datos.HoraFin })) {
        contexto.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'HoraFin debe ser mayor que HoraInicio.',
          path: ['HoraFin']
        });
      }
    }
  });

export const esquemaIdAsignacion = z.object({
  HorarioID: z.coerce
    .number({ invalid_type_error: 'El parámetro HorarioID debe ser numérico.' })
    .int('El parámetro HorarioID debe ser un entero.')
    .positive('El parámetro HorarioID debe ser positivo.')
});

export default {
  esquemaCrearAsignacion,
  esquemaActualizarAsignacion,
  esquemaIdAsignacion
};
