#!/usr/bin/env node
import "dotenv/config";

const API_BASE_URL = (process.env.API_BASE_URL || "http://localhost:3000/api").replace(/\/$/, "");
const ENDPOINT = `${API_BASE_URL}/alumnos`;

const alumnos = [
  { Nombre: "María Fernanda", Apellido: "Gutiérrez", Email: "maria.fernanda.gutierrez@correo.edu" },
  { Nombre: "José Alejandro", Apellido: "Ramírez", Email: "jose.alejandro.ramirez@correo.edu" },
  { Nombre: "Ana Sofía", Apellido: "Mendoza", Email: "ana.sofia.mendoza@correo.edu" },
  { Nombre: "Luis Gerardo", Apellido: "Carrillo", Email: "luis.gerardo.carrillo@correo.edu" },
  { Nombre: "Paola Andrea", Apellido: "Salazar", Email: "paola.andrea.salazar@correo.edu" },
  { Nombre: "Diego Armando", Apellido: "Luna", Email: "diego.armando.luna@correo.edu" },
  { Nombre: "Valeria", Apellido: "Domínguez", Email: "valeria.dominguez@correo.edu" },
  { Nombre: "Ricardo", Apellido: "Villanueva", Email: "ricardo.villanueva@correo.edu" },
  { Nombre: "Karla Gabriela", Apellido: "Reyes", Email: "karla.gabriela.reyes@correo.edu" },
  { Nombre: "Héctor Manuel", Apellido: "Castañeda", Email: "hector.manuel.castaneda@correo.edu" },
  { Nombre: "Montserrat", Apellido: "Pérez", Email: "montserrat.perez@correo.edu" },
  { Nombre: "Mauricio", Apellido: "Vega", Email: "mauricio.vega@correo.edu" },
  { Nombre: "Adriana", Apellido: "Nava", Email: "adriana.nava@correo.edu" },
  { Nombre: "Sebastián", Apellido: "Ortega", Email: "sebastian.ortega@correo.edu" },
  { Nombre: "Daniela", Apellido: "Calderón", Email: "daniela.calderon@correo.edu" },
  { Nombre: "Fernando", Apellido: "Ibarra", Email: "fernando.ibarra@correo.edu" },
  { Nombre: "Brenda", Apellido: "Rosales", Email: "brenda.rosales@correo.edu" },
  { Nombre: "Iván", Apellido: "Moreno", Email: "ivan.moreno@correo.edu" },
  { Nombre: "Marcela", Apellido: "Esquivel", Email: "marcela.esquivel@correo.edu" },
  { Nombre: "Óscar", Apellido: "Pacheco", Email: "oscar.pacheco@correo.edu" },
  { Nombre: "Patricia", Apellido: "Delgado", Email: "patricia.delgado@correo.edu" },
  { Nombre: "Rodrigo", Apellido: "Santiago", Email: "rodrigo.santiago@correo.edu" },
  { Nombre: "Fabiola", Apellido: "Quintana", Email: "fabiola.quintana@correo.edu" },
  { Nombre: "Guillermo", Apellido: "Treviño", Email: "guillermo.trevino@correo.edu" },
  { Nombre: "Liliana", Apellido: "Cornejo", Email: "liliana.cornejo@correo.edu" }
];

async function crearAlumno(payload) {
  const respuesta = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  const contenido = await respuesta.text();
  if (!respuesta.ok) {
    throw new Error(`Error ${respuesta.status}: ${contenido || respuesta.statusText}`);
  }

  try {
    return JSON.parse(contenido);
  } catch (error) {
    return contenido;
  }
}

async function ejecutar() {
  console.log(`Insertando ${alumnos.length} alumnos en ${ENDPOINT}`);
  for (const alumno of alumnos) {
    try {
      const resultado = await crearAlumno(alumno);
      const id = resultado?.datos?.AlumnoID ?? "desconocido";
      console.log(`✔️  ${alumno.Nombre} ${alumno.Apellido} creado (ID: ${id})`);
    } catch (error) {
      console.error(`❌  No se pudo crear ${alumno.Nombre} ${alumno.Apellido}:`, error.message);
    }
  }
  console.log("Proceso finalizado");
}

ejecutar().catch((error) => {
  console.error("Error general en la inserción de alumnos:", error);
  process.exitCode = 1;
});
