import { z } from 'zod';

const esquemaBase = {
  CarreraID: z.coerce
    .number({ invalid_type_error: 'El campo CarreraID debe ser numérico.' })
    .int('El campo CarreraID debe ser un entero.')
    .positive('El campo CarreraID debe ser positivo.'),
  Clave: z
    .string({ required_error: 'El campo Clave es obligatorio.' })
    .trim()
    .min(1, 'El campo Clave no puede estar vacío.')
    .max(20, 'El campo Clave admite hasta 20 caracteres.'),
  Nombre: z
    .string({ required_error: 'El campo Nombre es obligatorio.' })
    .trim()
    .min(1, 'El campo Nombre no puede estar vacío.')
    .max(120, 'El campo Nombre admite hasta 120 caracteres.'),
  Turno: z
    .string({ required_error: 'El campo Turno es obligatorio.' })
    .trim()
    .min(3, 'El campo Turno debe tener al menos 3 caracteres.')
    .max(20, 'El campo Turno admite hasta 20 caracteres.'),
  Activo: z
    .boolean({ invalid_type_error: 'El campo Activo debe ser booleano.' })
    .optional()
    .default(true)
};

export const esquemaCrearGrupo = z.object(esquemaBase);

export const esquemaActualizarGrupo = z.object({
  CarreraID: esquemaBase.CarreraID.optional(),
  Clave: esquemaBase.Clave.optional(),
  Nombre: esquemaBase.Nombre.optional(),
  Turno: esquemaBase.Turno.optional(),
  Activo: esquemaBase.Activo
});

export const esquemaIdGrupo = z.object({
  GrupoID: z.coerce
    .number({ invalid_type_error: 'El parámetro GrupoID debe ser numérico.' })
    .int('El parámetro GrupoID debe ser un entero.')
    .positive('El parámetro GrupoID debe ser positivo.')
});

export default {
  esquemaCrearGrupo,
  esquemaActualizarGrupo,
  esquemaIdGrupo
};
