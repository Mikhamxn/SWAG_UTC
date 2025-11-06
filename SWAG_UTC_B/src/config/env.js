import dotenv from 'dotenv';

dotenv.config();

const entorno = process.env;

const convertirAEntero = (valor, predeterminado) => {
  const numero = Number.parseInt(valor, 10);
  return Number.isFinite(numero) ? numero : predeterminado;
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
  }
};

export default Object.freeze(configuracion);
