import { ZodError } from 'zod';
import { registro } from '../utils/registro.js';

export const gestorErrores = (error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }

  if (error instanceof ZodError) {
    registro.advertencia('Error de validación', error.issues);
    return res.status(400).json({
      error: 'ErrorDeValidacion',
      mensaje: 'La carga enviada no superó la validación.',
      detalles: error.issues
    });
  }

  if (error.name === 'SequelizeUniqueConstraintError') {
    registro.advertencia('Violación de restricción única', error);
    return res.status(409).json({
      error: 'Conflicto',
      mensaje: 'Ya existe un registro con la strClave proporcionada.'
    });
  }

  if (error.name === 'SequelizeValidationError') {
    registro.advertencia('Error de validación de Sequelize', error);
    return res.status(400).json({
      error: 'ErrorDeValidacion',
      mensaje: 'Los datos no cumplen con las validaciones de la base de datos.',
      detalles: error.errors?.map(({ message, path }) => ({ mensaje: message, campo: path })) ?? []
    });
  }

  if (error.message === 'Origen no permitido por la configuración CORS.') {
    registro.advertencia('Intento de acceso desde un origen no autorizado', error);
    return res.status(403).json({
      error: 'OrigenNoPermitido',
      mensaje: 'El origen de la petición no está autorizado por la política CORS.'
    });
  }

  const status = error.statusCode || error.status || 500;
  const mensaje = error.message || 'Ocurrió un error inesperado en el servidor.';

  if (status >= 500) {
    registro.error(mensaje, error);
  } else {
    registro.advertencia(mensaje, error);
  }

  return res.status(status).json({
    error: status >= 500 ? 'ErrorInterno' : 'ErrorDelCliente',
    mensaje
  });
};

export default gestorErrores;
