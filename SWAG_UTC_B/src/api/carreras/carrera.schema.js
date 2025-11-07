import { z } from 'zod';

const esquemaBase = {
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
  Descripcion: z
    .string({ invalid_type_error: 'El campo Descripcion debe ser texto.' })
    .trim()
    .max(255, 'El campo Descripcion admite hasta 255 caracteres.')
    .nullable()
    .optional(),
  Activo: z
    .boolean({ invalid_type_error: 'El campo Activo debe ser booleano.' })
    .optional()
    .default(true)
};

export const esquemaCrearCarrera = z.object(esquemaBase);

export const esquemaActualizarCarrera = z.object({
  Clave: esquemaBase.Clave.optional(),
  Nombre: esquemaBase.Nombre.optional(),
  Descripcion: esquemaBase.Descripcion,
  Activo: esquemaBase.Activo
});

export const esquemaIdCarrera = z.object({
  CarreraID: z.coerce
    .number({ invalid_type_error: 'El parámetro CarreraID debe ser numérico.' })
    .int('El parámetro CarreraID debe ser un entero.')
    .positive('El parámetro CarreraID debe ser positivo.')
});

export default {
  esquemaCrearCarrera,
  esquemaActualizarCarrera,
  esquemaIdCarrera
};
