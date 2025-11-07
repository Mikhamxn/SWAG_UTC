import React, { useMemo, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  obtenerAlumnos,
  crearAlumno,
  actualizarAlumno,
  eliminarAlumno,
} from "../../services/alumnosService";

const ContenedorAnimado = motion.section;
const TarjetaAnimada = motion.article;

const esquemaValidacion = Yup.object({
  Nombre: Yup.string()
    .trim()
    .max(50, "El nombre no debe superar 50 caracteres")
    .required("El nombre es obligatorio"),
  Apellido: Yup.string()
    .trim()
    .max(50, "El apellido no debe superar 50 caracteres")
    .required("El apellido es obligatorio"),
  Email: Yup.string()
    .trim()
    .email("Debe ser un correo válido")
    .max(108, "El correo no debe superar 108 caracteres")
    .required("El correo es obligatorio"),
  Activo: Yup.boolean(),
});

const valoresPorDefecto = {
  Nombre: "",
  Apellido: "",
  Email: "",
  Activo: true,
};

const Alumnos = () => {
  const clienteQuery = useQueryClient();
  const [terminoBusqueda, establecerTerminoBusqueda] = useState("");
  const [alumnoEnEdicion, establecerAlumnoEnEdicion] = useState(null);
  const [valoresFormulario, establecerValoresFormulario] = useState(valoresPorDefecto);

  const {
    data: alumnos = { datos: [] },
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["alumnos"],
    queryFn: obtenerAlumnos,
    staleTime: 1000 * 60,
  });

  const accionCrearAlumno = useMutation({
    mutationFn: crearAlumno,
    onSuccess: () => {
      clienteQuery.invalidateQueries({ queryKey: ["alumnos"] });
    },
  });

  const accionActualizarAlumno = useMutation({
    mutationFn: ({ id, datos }) => actualizarAlumno(id, datos),
    onSuccess: () => {
      clienteQuery.invalidateQueries({ queryKey: ["alumnos"] });
    },
  });

  const accionEliminarAlumno = useMutation({
    mutationFn: (id) => eliminarAlumno(id),
    onSuccess: () => {
      clienteQuery.invalidateQueries({ queryKey: ["alumnos"] });
    },
  });

  const alumnosFiltrados = useMemo(() => {
    const lista = alumnos?.datos ?? [];
    if (!terminoBusqueda.trim()) {
      return lista;
    }
    const termino = terminoBusqueda.trim().toLowerCase();
    return lista.filter((alumno) =>
      [alumno.Nombre, alumno.Apellido, alumno.Email]
        .filter(Boolean)
        .some((valor) => valor.toLowerCase().includes(termino))
    );
  }, [alumnos, terminoBusqueda]);

  const limpiarFormulario = (helpers) => {
    helpers.resetForm({ values: valoresPorDefecto });
    helpers.setStatus(undefined);
    establecerValoresFormulario(valoresPorDefecto);
    establecerAlumnoEnEdicion(null);
  };

  return (
    <ContenedorAnimado
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="space-y-10"
    >
      <motion.header
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="flex flex-col gap-4"
      >
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="titulo-seccion">Gestión de alumnos</h2>
            <p className="descripcion-suave mt-2 max-w-2xl">
              Registra, edita y administra la información de los alumnos activos en el sistema.
            </p>
          </div>
        </div>
      </motion.header>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,360px)_1fr]">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="tarjeta-suave p-6 shadow-slate-200/80 xl:sticky xl:top-24 xl:h-fit"
        >
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-neutro-50">
                {alumnoEnEdicion ? "Editar alumno" : "Registrar nuevo alumno"}
              </h3>
              <p className="mt-1 text-sm text-slate-500 dark:text-neutro-300">
                {alumnoEnEdicion
                  ? "Actualiza la información y guarda los cambios."
                  : "Completa los campos y guarda para añadirlo al padrón."}
              </p>
            </div>
          </div>

          <Formik
            enableReinitialize
            initialValues={valoresFormulario}
            validationSchema={esquemaValidacion}
            onSubmit={async (valores, helpers) => {
              helpers.setStatus(undefined);
              try {
                if (alumnoEnEdicion) {
                  await accionActualizarAlumno.mutateAsync({
                    id: alumnoEnEdicion.AlumnoID,
                    datos: valores,
                  });
                  helpers.setStatus({ exito: "Alumno actualizado correctamente." });
                } else {
                  await accionCrearAlumno.mutateAsync(valores);
                  helpers.setStatus({ exito: "Alumno registrado correctamente." });
                }
                limpiarFormulario(helpers);
              } catch (errorCapturado) {
                console.error("No se pudo guardar el alumno", errorCapturado);
                helpers.setStatus({
                  fallo:
                    "No fue posible guardar el alumno. Verifica la información e inténtalo nuevamente.",
                });
              }
            }}
          >
            {({ isSubmitting, status, setFieldValue, values, resetForm }) => (
              <Form className="mt-6 space-y-5">
                <div className="campo-formulario">
                  <label className="etiqueta-formulario" htmlFor="Nombre">
                    Nombre
                  </label>
                  <Field
                    id="Nombre"
                    name="Nombre"
                    type="text"
                    className="input-formulario"
                    placeholder="Ej. Daniela"
                  />
                  <ErrorMessage name="Nombre" component="p" className="mensaje-error" />
                </div>

                <div className="campo-formulario">
                  <label className="etiqueta-formulario" htmlFor="Apellido">
                    Apellido
                  </label>
                  <Field
                    id="Apellido"
                    name="Apellido"
                    type="text"
                    className="input-formulario"
                    placeholder="Ej. Méndez"
                  />
                  <ErrorMessage name="Apellido" component="p" className="mensaje-error" />
                </div>

                <div className="campo-formulario">
                  <label className="etiqueta-formulario" htmlFor="Email">
                    Correo electrónico
                  </label>
                  <Field
                    id="Email"
                    name="Email"
                    type="email"
                    className="input-formulario"
                    placeholder="alumno@utc.edu.mx"
                  />
                  <ErrorMessage name="Email" component="p" className="mensaje-error" />
                </div>

                <div className="flex items-center gap-3 rounded-xl bg-slate-50 px-3 py-3 text-sm font-medium text-slate-600 dark:bg-oscuro-200/80 dark:text-neutro-200">
                  <Field
                    id="Activo"
                    name="Activo"
                    type="checkbox"
                    checked={values.Activo}
                    onChange={(evento) => setFieldValue("Activo", evento.target.checked)}
                    className="h-5 w-5 rounded border-slate-300 text-primario-500 focus:ring-primario-500 dark:border-oscuro-300 dark:bg-oscuro-100"
                  />
                  <label htmlFor="Activo">Alumno activo</label>
                </div>

                <div className="flex flex-col gap-3 pt-2">
                  <button
                    type="submit"
                    className="boton-principal w-full"
                    disabled={
                      isSubmitting ||
                      accionCrearAlumno.isPending ||
                      accionActualizarAlumno.isPending
                    }
                  >
                    {alumnoEnEdicion
                      ? accionActualizarAlumno.isPending
                        ? "Actualizando..."
                        : "Actualizar alumno"
                      : accionCrearAlumno.isPending
                      ? "Guardando..."
                      : "Guardar alumno"}
                  </button>

                  {alumnoEnEdicion && (
                    <button
                      type="button"
                      className="boton-secundario w-full"
                      onClick={() => {
                        resetForm({ values: valoresPorDefecto });
                        establecerAlumnoEnEdicion(null);
                        establecerValoresFormulario(valoresPorDefecto);
                      }}
                    >
                      Cancelar edición
                    </button>
                  )}
                </div>

                {status?.fallo && (
                  <p className="mensaje-estado mensaje-fallo">{status.fallo}</p>
                )}
                {status?.exito && (
                  <p className="mensaje-estado mensaje-exito">{status.exito}</p>
                )}
              </Form>
            )}
          </Formik>
        </motion.div>

        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut", delay: 0.08 }}
          className="tarjeta-suave overflow-hidden"
        >
          <div className="border-b border-slate-100 bg-white/90 px-6 py-5 dark:border-oscuro-200/60 dark:bg-oscuro-200/70">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-neutro-50">
                  Padrón de alumnos
                </h3>
                <p className="text-sm text-slate-500 dark:text-neutro-300">
                  Consulta y administra a los alumnos registrados en la institución.
                </p>
              </div>
              <div className="relative w-full sm:w-64">
                <input
                  type="search"
                  value={terminoBusqueda}
                  onChange={(evento) => establecerTerminoBusqueda(evento.target.value)}
                  placeholder="Buscar por nombre o correo..."
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 pr-10 text-sm font-medium text-slate-600 shadow-sm transition focus:border-primario-500 focus:outline-none focus:ring-2 focus:ring-primario-500/30 dark:border-oscuro-300 dark:bg-oscuro-200/60 dark:text-neutro-200 dark:focus:border-esmeralda-500 dark:focus:ring-esmeralda-500/30"
                />
                <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-400 dark:text-neutro-500">
                  🔍
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-6 px-6 py-6">
            {isLoading && (
              <p className="text-sm text-slate-500 dark:text-neutro-300">Cargando alumnos...</p>
            )}

            {isError && (
              <p className="mensaje-estado mensaje-fallo">
                Ocurrió un error al obtener los alumnos: {error?.message || "Error desconocido"}
              </p>
            )}

            {!isLoading && !isError && alumnosFiltrados.length === 0 && (
              <p className="text-sm font-medium text-slate-400 dark:text-neutro-500">
                No hay alumnos registrados.
              </p>
            )}

            <motion.div layout className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {alumnosFiltrados.map((alumno, indice) => (
                <TarjetaAnimada
                  key={alumno.AlumnoID}
                  layout
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, ease: "easeOut", delay: indice * 0.02 }}
                  whileHover={{ y: -6, scale: 1.01 }}
                  className="flex flex-col gap-4 rounded-2xl border border-slate-100 bg-white/90 p-5 shadow-md shadow-slate-200/60 transition hover:shadow-lg dark:border-oscuro-300/70 dark:bg-oscuro-200/70 dark:shadow-black/20 dark:hover:border-esmeralda-500/40"
                >
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400 dark:text-neutro-500">
                      ID {alumno.AlumnoID}
                    </p>
                    <h4 className="mt-3 text-lg font-semibold text-slate-900 dark:text-neutro-50">
                      {alumno.Nombre} {alumno.Apellido}
                    </h4>
                    <p className="mt-1 text-sm font-medium text-slate-500 dark:text-neutro-300">
                      {alumno.Email}
                    </p>
                  </div>

                  <div className="mt-auto flex items-center justify-between text-xs font-semibold uppercase tracking-wide">
                    <span
                      className={`rounded-full px-3 py-1 text-[11px] ${
                        alumno.Activo
                          ? "bg-esmeralda-500/10 text-esmeralda-600 dark:bg-esmeralda-500/20 dark:text-esmeralda-400"
                          : "bg-rose-500/10 text-rose-500 dark:bg-rose-500/20 dark:text-rose-300"
                      }`}
                    >
                      {alumno.Activo ? "Activo" : "Inactivo"}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        className="texto-accion"
                        onClick={() => {
                          establecerAlumnoEnEdicion(alumno);
                          establecerValoresFormulario({
                            Nombre: alumno.Nombre,
                            Apellido: alumno.Apellido,
                            Email: alumno.Email,
                            Activo: Boolean(alumno.Activo),
                          });
                        }}
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        className="texto-accion texto-accion--peligro"
                        disabled={accionEliminarAlumno.isPending}
                        onClick={() => accionEliminarAlumno.mutate(alumno.AlumnoID)}
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                </TarjetaAnimada>
              ))}
            </motion.div>
          </div>
        </motion.section>
      </div>
    </ContenedorAnimado>
  );
};

export default Alumnos;
