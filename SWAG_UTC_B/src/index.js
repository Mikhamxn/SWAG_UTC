import express from 'express';
import cors from 'cors';
import configuracion from './config/env.js';
import { iniciarBaseDatos } from './config/db.js';
import enrutadorMaterias from './api/materias/materia.routes.js';
import enrutadorAlumnos from './api/alumnos/alumno.routes.js';
import enrutadorProfesores from './api/profesores/profesor.routes.js';
import enrutadorAsignaciones from './api/asignaciones/asignacion.routes.js';
import enrutadorCarreras from './api/carreras/carrera.routes.js';
import enrutadorGrupos from './api/grupos/grupo.routes.js';
import enrutadorGrupoAlumnos from './api/grupo-alumnos/grupoAlumno.routes.js';
import rutaNoEncontrada from './middlewares/notFound.js';
import gestorErrores from './middlewares/errorHandler.js';
import { registro } from './utils/registro.js';
import './api/materias/materia.model.js';
import './api/alumnos/alumno.model.js';
import './api/profesores/profesor.model.js';
import './api/asignaciones/asignacion.model.js';
import './api/carreras/carrera.model.js';
import './api/grupos/grupo.model.js';
import './api/grupo-alumnos/grupoAlumno.model.js';

const aplicacion = express();

const opcionesCors = {
  origin: (origen, concluir) => {
    const permitidos = configuracion.origenesPermitidos;
    if (!origen) {
      concluir(null, true);
      return;
    }
    if (permitidos.length === 0 || permitidos.includes(origen)) {
      concluir(null, true);
      return;
    }
    concluir(new Error('Origen no permitido por la configuración CORS.'));
  },
  credentials: true
};

aplicacion.use(cors(opcionesCors));
aplicacion.options('*', cors(opcionesCors));
aplicacion.use(express.json());

aplicacion.get('/salud', (req, res) => {
  res.json({ estado: 'ok' });
});

aplicacion.use('/api/materias', enrutadorMaterias);
aplicacion.use('/api/alumnos', enrutadorAlumnos);
aplicacion.use('/api/profesores', enrutadorProfesores);
aplicacion.use('/api/asignaciones', enrutadorAsignaciones);
aplicacion.use('/api/carreras', enrutadorCarreras);
aplicacion.use('/api/grupos', enrutadorGrupos);
aplicacion.use('/api/grupo-alumnos', enrutadorGrupoAlumnos);

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

POST   http://localhost:3000/api/alumnos
GET    http://localhost:3000/api/alumnos
PUT    http://localhost:3000/api/alumnos/1
DELETE http://localhost:3000/api/alumnos/1

POST   http://localhost:3000/api/profesores
GET    http://localhost:3000/api/profesores
PUT    http://localhost:3000/api/profesores/1
DELETE http://localhost:3000/api/profesores/1

POST   http://localhost:3000/api/asignaciones
GET    http://localhost:3000/api/asignaciones
PUT    http://localhost:3000/api/asignaciones/1
DELETE http://localhost:3000/api/asignaciones/1

POST   http://localhost:3000/api/carreras
GET    http://localhost:3000/api/carreras
PUT    http://localhost:3000/api/carreras/1
DELETE http://localhost:3000/api/carreras/1

POST   http://localhost:3000/api/grupos
GET    http://localhost:3000/api/grupos
PUT    http://localhost:3000/api/grupos/1
DELETE http://localhost:3000/api/grupos/1

POST   http://localhost:3000/api/grupo-alumnos
GET    http://localhost:3000/api/grupo-alumnos?GrupoID=1
PUT    http://localhost:3000/api/grupo-alumnos/1/10
DELETE http://localhost:3000/api/grupo-alumnos/1/10
*/
