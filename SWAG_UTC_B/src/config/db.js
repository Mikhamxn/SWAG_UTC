import { Sequelize } from 'sequelize';
import configuracion from './env.js';
import { registro } from '../utils/registro.js';

const opcionesDialecto = configuracion.baseDatos.dialecto === 'mssql'
  ? {
      options: {
        encrypt: false,
        trustServerCertificate: true
      }
    }
  : {};

export const conexion = new Sequelize(
  configuracion.baseDatos.nombre,
  configuracion.baseDatos.usuario,
  configuracion.baseDatos.contrasena,
  {
    host: configuracion.baseDatos.host,
    port: configuracion.baseDatos.puerto,
    dialect: configuracion.baseDatos.dialecto,
    logging: configuracion.esDesarrollo ? (mensaje) => registro.depuracion(mensaje) : false,
    define: {
      freezeTableName: true
    },
    dialectOptions: opcionesDialecto
  }
);

export const iniciarBaseDatos = async () => {
  try {
    await conexion.authenticate();
    registro.info('Conexión a la base de datos establecida');
    await conexion.sync();
    registro.info('Modelos sincronizados con la base de datos');
  } catch (error) {
    registro.error('No fue posible inicializar la base de datos', error);
    throw error;
  }
};

export const obtenerConexion = () => conexion;
