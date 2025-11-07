// Datos ficticios para el dashboard
// Mantener la misma forma que la API: objetos con propiedad `datos` o arreglos
const alumnos = Array.from({ length: 124 }, (_, i) => ({
  id: i + 1,
  Nombre: `Alumno ${i + 1}`,
  Matricula: `A${1000 + i}`,
  Activo: Math.random() > 0.05
}));

const profesores = Array.from({ length: 18 }, (_, i) => ({
  id: i + 1,
  Nombre: `Profesor ${i + 1}`,
  Email: `prof${i + 1}@mail.test`,
  Activo: Math.random() > 0.1
}));

const materias = Array.from({ length: 32 }, (_, i) => ({
  id: i + 1,
  Nombre: `Materia ${i + 1}`,
  Clave: `M${100 + i}`,
  Activo: Math.random() > 0.2
}));

const turnos = ["Matutino", "Vespertino", "Nocturno"];
const grupos = Array.from({ length: 14 }, (_, i) => ({
  id: i + 1,
  Nombre: `Grupo ${String.fromCharCode(65 + (i % 26))}${Math.floor(i / 26) + 1}`,
  Turno: turnos[i % turnos.length],
  Clave: `G${200 + i}`
}));

// Aulas y edificios
const edificios = ["Edificio A", "Edificio B", "Edificio C"];
const aulas = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  Nombre: `Aula ${100 + i}`,
  Edificio: edificios[i % edificios.length],
  Capacidad: 20 + (i % 6) * 5
}));

// Asignar un aula a cada grupo
grupos.forEach((g, idx) => {
  const aula = aulas[idx % aulas.length];
  g.AulaID = aula.id;
  g.Aula = aula;
});

// Asignaciones distribuidas por día
const dias = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];
const asignaciones = Array.from({ length: 48 }, (_, i) => ({
  id: i + 1,
  MateriaID: (i % materias.length) + 1,
  GrupoID: (i % grupos.length) + 1,
  DiaSemana: dias[i % dias.length],
  Hora: `${8 + (i % 10)}:00`
}));

// Añadir ProfesorID a cada asignacion (para saber quién da la clase)
asignaciones.forEach((a, idx) => {
  a.ProfesorID = ((idx % profesores.length) + 1);
  // Opcional: incluir el Aula asignada al Grupo
  const grupo = grupos.find((g) => g.id === a.GrupoID);
  if (grupo) {
    a.AulaID = grupo.AulaID;
    a.Aula = grupo.Aula;
  }
});

// Relaciones alumno -> grupo
const grupoAlumnos = [];
// distribuir alumnos entre grupos
alumnos.forEach((alumno, idx) => {
  const group = grupos[idx % grupos.length];
  grupoAlumnos.push({
    id: grupoAlumnos.length + 1,
    AlumnoID: alumno.id,
    GrupoID: group.id,
    Grupo: group
  });
});

export default {
  alumnos,
  profesores,
  materias,
  grupos,
  aulas,
  asignaciones,
  grupoAlumnos
};
