export const manejadorAsincrono = (controlador) => async (req, res, next) => {
  try {
    await controlador(req, res, next);
  } catch (error) {
    next(error);
  }
};

export default manejadorAsincrono;
