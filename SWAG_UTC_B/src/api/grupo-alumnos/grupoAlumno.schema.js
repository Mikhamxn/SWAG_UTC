import { z } from 'zod';

const identificadorGrupo = z.coerce
  .number({ invalid_type_error: 'El campo GrupoID debe ser numérico.' })
  .int('El campo GrupoID debe ser un entero.')
  .positive('El campo GrupoID debe ser positivo.');

const identificadorAlumno = z.coerce
  .number({ invalid_type_error: 'El campo AlumnoID debe ser numérico.' })
  .int('El campo AlumnoID debe ser un entero.')
  .positive('El campo AlumnoID debe ser positivo.');

const base = {
  GrupoID: identificadorGrupo,
  AlumnoID: identificadorAlumno,
  Activo: z
    .boolean({ invalid_type_error: 'El campo Activo debe ser booleano.' })
    .optional()
    .default(true)
};

export const esquemaCrearGrupoAlumno = z.object(base);

export const esquemaActualizarGrupoAlumno = z
  .object({
    Activo: base.Activo.optional()
  })
  .refine((datos) => Object.keys(datos).length > 0, {
    message: 'Debe especificar al menos un campo para actualizar.'
  });

export const esquemaIdentificadores = z.object({
  GrupoID: identificadorGrupo,
  AlumnoID: identificadorAlumno
});

export const esquemaConsultaGrupoAlumno = z.object({
  GrupoID: identificadorGrupo.optional(),
  AlumnoID: identificadorAlumno.optional(),
  Activo: z
    .preprocess((valor) => {
      if (valor === undefined) {
        return undefined;
      }
      if (valor === 'true' || valor === true) {
        return true;
      }
      if (valor === 'false' || valor === false) {
        return false;
      }
      return valor;
    },
    z.boolean({ invalid_type_error: 'El parámetro Activo debe ser booleano.' }).optional())
});

export default {
  esquemaCrearGrupoAlumno,
  esquemaActualizarGrupoAlumno,
  esquemaIdentificadores,
  esquemaConsultaGrupoAlumno
};
