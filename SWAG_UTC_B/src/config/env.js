import dotenv from 'dotenv';

dotenv.config();

const entorno = process.env;

const convertirAEntero = (valor, predeterminado) => {
  const numero = Number.parseInt(valor, 10);
  return Number.isFinite(numero) ? numero : predeterminado;
};

const convertirALista = (valor, predeterminado = []) => {
  if (typeof valor !== 'string') {
    return predeterminado;
  }
  return valor
    .split(',')
    .map((elemento) => elemento.trim())
    .filter((elemento) => elemento.length > 0);
};

const configuracion = {
  entorno: entorno.NODE_ENV ?? 'development',
  puerto: convertirAEntero(entorno.PORT, 3000),
  esDesarrollo: (entorno.NODE_ENV ?? 'development') === 'development',
  baseDatos: {
    dialecto: entorno.DB_DIALECT ?? 'mssql',
    host: entorno.DB_HOST ?? 'localhost',
    puerto: convertirAEntero(entorno.DB_PORT, 1433),
    nombre: entorno.DB_NAME ?? 'utc_swag',
    usuario: entorno.DB_USER ?? 'postgres',
    contrasena: entorno.DB_PASSWORD ?? 'postgres'
  },
  origenesPermitidos: convertirALista(entorno.CORS_ORIGENES, ['http://localhost:5173'])
};

export default Object.freeze(configuracion);
