const formatearMensaje = (nivel, mensaje) => {
  const marcaTemporal = new Date().toISOString();
  return `[${marcaTemporal}] [${nivel.toUpperCase()}] ${mensaje}`;
};

const imprimir = (nivel, mensaje, meta) => {
  const mensajeFormateado = formatearMensaje(nivel, mensaje);
  const metodo = nivel === 'info' ? 'log' : nivel;
  const metodoConsola = typeof console[metodo] === 'function' ? metodo : 'log';

  if (meta instanceof Error) {
    console[metodoConsola](mensajeFormateado, meta);
    return;
  }

  if (meta !== undefined) {
    console[metodoConsola](mensajeFormateado, meta);
    return;
  }

  console[metodoConsola](mensajeFormateado);
};

export const registro = {
  info: (mensaje, meta) => imprimir('info', mensaje, meta),
  advertencia: (mensaje, meta) => imprimir('warn', mensaje, meta),
  error: (mensaje, meta) => imprimir('error', mensaje, meta),
  depuracion: (mensaje, meta) => imprimir('debug', mensaje, meta)
};

export default registro;
