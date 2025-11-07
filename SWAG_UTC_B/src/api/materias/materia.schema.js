import { z } from 'zod';

const esquemaBase = {
  Nombre: z
    .string({ required_error: 'El campo Nombre es obligatorio.' })
    .trim()
    .min(1, 'El campo Nombre no puede estar vacío.')
    .max(100, 'El campo Nombre admite hasta 100 caracteres.'),
  Descripcion: z
    .string({ required_error: 'El campo Descripcion es obligatorio.' })
    .trim()
    .min(1, 'El campo Descripcion no puede estar vacío.')
    .max(255, 'El campo Descripcion admite hasta 255 caracteres.'),
  Activo: z
    .boolean({ invalid_type_error: 'El campo Activo debe ser booleano.' })
    .optional()
    .default(true)
};

export const esquemaCrearMateria = z.object(esquemaBase);

export const esquemaActualizarMateria = z.object({
  ...esquemaBase,
  Activo: z
    .boolean({ invalid_type_error: 'El campo Activo debe ser booleano.' })
    .optional()
});

export const esquemaIdMateria = z.object({
  MateriaID: z.coerce
    .number({ invalid_type_error: 'El parámetro MateriaID debe ser numérico.' })
    .int('El parámetro MateriaID debe ser un entero.')
    .positive('El parámetro MateriaID debe ser positivo.')
});

export default {
  esquemaCrearMateria,
  esquemaActualizarMateria,
  esquemaIdMateria
};
