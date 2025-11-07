import { z } from 'zod';

const esquemaBase = {
  Admin: z
    .boolean({ invalid_type_error: 'El campo Admin debe ser booleano.' })
    .optional()
    .default(false),
  Nombre: z
    .string({ required_error: 'El campo Nombre es obligatorio.' })
    .trim()
    .min(1, 'El Nombre no puede estar vacío.')
    .max(50, 'El Nombre admite hasta 50 caracteres.'),
  Apellido: z
    .string({ required_error: 'El campo Apellido es obligatorio.' })
    .trim()
    .min(1, 'El Apellido no puede estar vacío.')
    .max(50, 'El Apellido admite hasta 50 caracteres.'),
  Email: z
    .string({ required_error: 'El campo Email es obligatorio.' })
    .trim()
    .email('El Email no es válido.')
    .max(100, 'El Email admite hasta 100 caracteres.'),
  Activo: z
    .boolean({ invalid_type_error: 'El campo Activo debe ser booleano.' })
    .optional()
    .default(true)
};

export const esquemaCrearProfesor = z.object(esquemaBase);

export const esquemaActualizarProfesor = z.object({
  Admin: esquemaBase.Admin.optional(),
  Nombre: esquemaBase.Nombre.optional(),
  Apellido: esquemaBase.Apellido.optional(),
  Email: esquemaBase.Email.optional(),
  Activo: esquemaBase.Activo.optional()
});

export const esquemaIdProfesor = z.object({
  ProfesorID: z.coerce
    .number({ invalid_type_error: 'El parámetro ProfesorID debe ser numérico.' })
    .int('El parámetro ProfesorID debe ser un entero.')
    .positive('El parámetro ProfesorID debe ser positivo.')
});

export default {
  esquemaCrearProfesor,
  esquemaActualizarProfesor,
  esquemaIdProfesor
};
