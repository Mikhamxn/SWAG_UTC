import { z } from 'zod';

const esquemaBase = {
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
    .max(108, 'El Email admite hasta 108 caracteres.'),
  Activo: z
    .boolean({ invalid_type_error: 'El campo Activo debe ser booleano.' })
    .optional()
    .default(true)
};

export const esquemaCrearAlumno = z.object(esquemaBase);

export const esquemaActualizarAlumno = z.object({
  Nombre: esquemaBase.Nombre.optional(),
  Apellido: esquemaBase.Apellido.optional(),
  Email: esquemaBase.Email.optional(),
  Activo: esquemaBase.Activo.optional()
});

export const esquemaIdAlumno = z.object({
  AlumnoID: z.coerce
    .number({ invalid_type_error: 'El parámetro AlumnoID debe ser numérico.' })
    .int('El parámetro AlumnoID debe ser un entero.')
    .positive('El parámetro AlumnoID debe ser positivo.')
});

export default {
  esquemaCrearAlumno,
  esquemaActualizarAlumno,
  esquemaIdAlumno
};
