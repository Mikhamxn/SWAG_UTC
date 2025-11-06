import express from 'express';
import cors from 'cors';
import configuracion from './config/env.js';
import { iniciarBaseDatos } from './config/db.js';
import enrutadorMaterias from './api/materias/materia.routes.js';
import rutaNoEncontrada from './middlewares/notFound.js';
import gestorErrores from './middlewares/errorHandler.js';
import { registro } from './utils/registro.js';
import './api/materias/materia.model.js';

const aplicacion = express();

aplicacion.use(cors());
aplicacion.use(express.json());

aplicacion.get('/salud', (req, res) => {
  res.json({ estado: 'ok' });
});

aplicacion.use('/api/materias', enrutadorMaterias);

aplicacion.use(rutaNoEncontrada);
aplicacion.use(gestorErrores);

const iniciar = async () => {
  try {
    await iniciarBaseDatos();
    aplicacion.listen(configuracion.puerto, () => {
      registro.info(`API escuchando en el puerto ${configuracion.puerto} (modo ${configuracion.entorno})`);
    });
  } catch (error) {
    registro.error('Fallo al iniciar el servidor', error);
    process.exit(1);
  }
};

if (process.env.NODE_ENV !== 'test') {
  iniciar();
}

export default aplicacion;

/*
Ejemplos de uso (ajusta host/puerto según sea necesario):
POST   http://localhost:3000/api/materias        
GET    http://localhost:3000/api/materias
GET    http://localhost:3000/api/materias/1
PUT    http://localhost:3000/api/materias/1     
DELETE http://localhost:3000/api/materias/1
*/
