export const rutaNoEncontrada = (req, res) => {
  res.status(404).json({
    error: 'RutaNoEncontrada',
    mensaje: `La ruta ${req.originalUrl} no existe.`
  });
};

export default rutaNoEncontrada;
