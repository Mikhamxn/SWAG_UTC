export const validar = (esquema, propiedad = 'body') => (req, res, next) => {
  try {
    const datosValidados = esquema.parse(req[propiedad]);
    req[propiedad] = datosValidados;
    return next();
  } catch (error) {
    return next(error);
  }
};

export default validar;
