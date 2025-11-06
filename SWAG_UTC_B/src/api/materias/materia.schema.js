import { z } from 'zod';

const esquemaBase = {
  strClave: z
    .string({ required_error: 'El campo strClave es obligatorio.' })
    .trim()
    .min(1, 'El campo strClave no puede estar vacío.')
    .max(50, 'El campo strClave admite hasta 50 caracteres.'),
  strNombre: z
    .string({ required_error: 'El campo strNombre es obligatorio.' })
    .trim()
    .min(1, 'El campo strNombre no puede estar vacío.')
    .max(100, 'El campo strNombre admite hasta 100 caracteres.'),
  intTotalSesiones: z.coerce
    .number({ invalid_type_error: 'El campo intTotalSesiones debe ser numérico.' })
    .int('El campo intTotalSesiones debe ser un entero.')
    .positive('El campo intTotalSesiones debe ser mayor a cero.')
};

export const esquemaCrearMateria = z.object(esquemaBase);

export const esquemaActualizarMateria = esquemaCrearMateria;

export const esquemaIdMateria = z.object({
  intMateria: z.coerce
    .number({ invalid_type_error: 'El parámetro intMateria debe ser numérico.' })
    .int('El parámetro intMateria debe ser un entero.')
    .positive('El parámetro intMateria debe ser positivo.')
});

export default {
  esquemaCrearMateria,
  esquemaActualizarMateria,
  esquemaIdMateria
};
