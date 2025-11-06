import React, { useState } from "react";
import { motion } from "framer-motion";

const MotionForm = motion.form;
const MotionDiv = motion.div;

const RegistroAlumnos = () => {
  const [alumno, setAlumno] = useState({
    nombre: "",
    apellido: "",
    correo: "",
    matricula: "",
    carrera: "",
  });

  const [listaAlumnos, setListaAlumnos] = useState([]);

  const handleChange = (e) => {
    setAlumno({ ...alumno, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setListaAlumnos([...listaAlumnos, alumno]);
    console.log("Alumno registrado:", alumno);

    setAlumno({
      nombre: "",
      apellido: "",
      correo: "",
      
      matricula: "",
      carrera: "",
    });
  };

  return (
    <motion.section
      className="materias"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
    >
      <motion.header
        className="materias__header"
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <h2 className="materias__title">Registro de Alumnos</h2>
        <p className="materias__subtitle">
          Registra alumnos y consulta la lista dentro del sistema.
        </p>
      </motion.header>

      <MotionForm
        className="materias__form"
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
      >
        <div className="materias__group">
          <label className="materias__label">Nombre</label>
          <input
            className="materias__input"
            type="text"
            name="nombre"
            value={alumno.nombre}
            onChange={handleChange}
            required
          />
        </div>

        <div className="materias__group">
          <label className="materias__label">Apellido</label>
          <input
            className="materias__input"
            type="text"
            name="apellido"
            value={alumno.apellido}
            onChange={handleChange}
            required
          />
        </div>

        <div className="materias__group">
          <label className="materias__label">Correo</label>
          <input
            className="materias__input"
            type="email"
            name="correo"
            value={alumno.correo}
            onChange={handleChange}
            required
          />
        </div>

        

        <div className="materias__group">
          <label className="materias__label">Matrícula</label>
          <input
            className="materias__input"
            type="text"
            name="matricula"
            value={alumno.matricula}
            onChange={handleChange}
            required
          />
        </div>

        <div className="materias__group">
          <label className="materias__label">Carrera</label>
          <input
            className="materias__input"
            type="text"
            name="carrera"
            value={alumno.carrera}
            onChange={handleChange}
            required
          />
        </div>

        <div className="materias__actions">
          <button type="submit" className="button-primary">
            Registrar
          </button>
        </div>
      </MotionForm>

      <motion.section
        className="materias__list"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut", delay: 0.08 }}
      >
        {listaAlumnos.length === 0 ? (
          <p className="muted-text">No hay alumnos registrados aún.</p>
        ) : (
          listaAlumnos.map((a, i) => (
            <MotionDiv
              key={i}
              className="materias__item"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <p><strong>Nombre:</strong> {a.nombre} {a.apellido}</p>
              <p><strong>Correo:</strong> {a.correo}</p>
              <p><strong>Matrícula:</strong> {a.matricula}</p>
              <p><strong>Carrera:</strong> {a.carrera}</p>
            </MotionDiv>
          ))
        )}
      </motion.section>
    </motion.section>
  );
};

export default RegistroAlumnos;




