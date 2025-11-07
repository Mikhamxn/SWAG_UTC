import React, { useMemo, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  obtenerCarreras,
  crearCarrera,
  actualizarCarrera,
  eliminarCarrera,
} from "../../services/carrerasService";

const ContenedorAnimado = motion.section;
const TarjetaAnimada = motion.article;

const esquemaValidacion = Yup.object({
  Clave: Yup.string()
    .trim()
    .max(20, "La clave no debe superar 20 caracteres")
    .required("La clave es obligatoria"),
  Nombre: Yup.string()
    .trim()
    .max(120, "El nombre no debe superar 120 caracteres")
    .required("El nombre es obligatorio"),
  Descripcion: Yup.string().trim().max(255, "La descripción no debe superar 255 caracteres"),
  Activo: Yup.boolean(),
});

const valoresPorDefecto = {
  Clave: "",
  Nombre: "",
  Descripcion: "",
  Activo: true,
};

const Carreras = () => {
  const clienteQuery = useQueryClient();
  const [terminoBusqueda, definirTerminoBusqueda] = useState("");
  const [carreraEnEdicion, definirCarreraEnEdicion] = useState(null);
  const [valoresFormulario, definirValoresFormulario] = useState(valoresPorDefecto);

  const {
    data: carreras = { datos: [] },
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["carreras"],
    queryFn: obtenerCarreras,
    staleTime: 1000 * 60,
  });

  const accionCrearCarrera = useMutation({
    mutationFn: crearCarrera,
    onSuccess: () => clienteQuery.invalidateQueries({ queryKey: ["carreras"] }),
  });

  const accionActualizarCarrera = useMutation({
    mutationFn: ({ id, datos }) => actualizarCarrera(id, datos),
    onSuccess: () => clienteQuery.invalidateQueries({ queryKey: ["carreras"] }),
  });

  const accionEliminarCarrera = useMutation({
    mutationFn: (id) => eliminarCarrera(id),
    onSuccess: () => clienteQuery.invalidateQueries({ queryKey: ["carreras"] }),
  });

  const carrerasFiltradas = useMemo(() => {
    const lista = carreras?.datos ?? [];
    if (!terminoBusqueda.trim()) {
      return lista;
    }
    const termino = terminoBusqueda.trim().toLowerCase();
    return lista.filter((carrera) =>
      [carrera.Clave, carrera.Nombre, carrera.Descripcion]
        .filter(Boolean)
        .some((valor) => valor.toLowerCase().includes(termino))
    );
  }, [carreras, terminoBusqueda]);

  const limpiarFormulario = (helpers) => {
    helpers.resetForm({ values: valoresPorDefecto });
    helpers.setStatus(undefined);
    definirValoresFormulario(valoresPorDefecto);
    definirCarreraEnEdicion(null);
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
            <h2 className="titulo-seccion">Gestión de carreras</h2>
            <p className="descripcion-suave mt-2 max-w-2xl">
              Registra y administra las carreras académicas con su clave institucional y estado.
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
                {carreraEnEdicion ? "Editar carrera" : "Registrar nueva carrera"}
              </h3>
              <p className="mt-1 text-sm text-slate-500 dark:text-neutro-300">
                {carreraEnEdicion
                  ? "Actualiza la información y guarda los cambios."
                  : "Captura la clave, el nombre y una breve descripción de la carrera."}
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
                if (carreraEnEdicion) {
                  await accionActualizarCarrera.mutateAsync({
                    id: carreraEnEdicion.CarreraID,
                    datos: valores,
                  });
                  helpers.setStatus({ exito: "Carrera actualizada correctamente." });
                } else {
                  await accionCrearCarrera.mutateAsync(valores);
                  helpers.setStatus({ exito: "Carrera registrada correctamente." });
                }
                limpiarFormulario(helpers);
              } catch (errorCapturado) {
                console.error("No se pudo guardar la carrera", errorCapturado);
                helpers.setStatus({
                  fallo: "No fue posible guardar la carrera. Verifica la información e inténtalo nuevamente.",
                });
              }
            }}
          >
            {({ isSubmitting, status, setFieldValue, values, resetForm }) => (
              <Form className="mt-6 space-y-5">
                <div className="campo-formulario">
                  <label className="etiqueta-formulario" htmlFor="Clave">
                    Clave institucional
                  </label>
                  <Field
                    id="Clave"
                    name="Clave"
                    type="text"
                    className="input-formulario"
                    placeholder="Ej. ISC-2024"
                  />
                  <ErrorMessage name="Clave" component="p" className="mensaje-error" />
                </div>

                <div className="campo-formulario">
                  <label className="etiqueta-formulario" htmlFor="Nombre">
                    Nombre de la carrera
                  </label>
                  <Field
                    id="Nombre"
                    name="Nombre"
                    type="text"
                    className="input-formulario"
                    placeholder="Ingeniería en Sistemas Computacionales"
                  />
                  <ErrorMessage name="Nombre" component="p" className="mensaje-error" />
                </div>

                <div className="campo-formulario">
                  <label className="etiqueta-formulario" htmlFor="Descripcion">
                    Descripción
                  </label>
                  <Field
                    as="textarea"
                    rows={3}
                    id="Descripcion"
                    name="Descripcion"
                    className="input-formulario"
                    placeholder="Breve resumen del enfoque de la carrera"
                  />
                  <ErrorMessage name="Descripcion" component="p" className="mensaje-error" />
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
                  <label htmlFor="Activo">Carrera activa</label>
                </div>

                <div className="flex flex-col gap-3 pt-2">
                  <button
                    type="submit"
                    className="boton-principal w-full"
                    disabled={
                      isSubmitting ||
                      accionCrearCarrera.isPending ||
                      accionActualizarCarrera.isPending
                    }
                  >
                    {carreraEnEdicion
                      ? accionActualizarCarrera.isPending
                        ? "Actualizando..."
                        : "Actualizar carrera"
                      : accionCrearCarrera.isPending
                      ? "Guardando..."
                      : "Guardar carrera"}
                  </button>

                  {carreraEnEdicion && (
                    <button
                      type="button"
                      className="boton-secundario w-full"
                      onClick={() => {
                        resetForm({ values: valoresPorDefecto });
                        definirCarreraEnEdicion(null);
                        definirValoresFormulario(valoresPorDefecto);
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
                  Catálogo de carreras
                </h3>
                <p className="text-sm text-slate-500 dark:text-neutro-300">
                  Consulta y administra las carreras disponibles para asignación de grupos.
                </p>
              </div>
              <div className="relative w-full sm:w-64">
                <input
                  type="search"
                  value={terminoBusqueda}
                  onChange={(evento) => definirTerminoBusqueda(evento.target.value)}
                  placeholder="Buscar por clave o nombre..."
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
              <p className="text-sm text-slate-500 dark:text-neutro-300">Cargando carreras...</p>
            )}

            {isError && (
              <p className="mensaje-estado mensaje-fallo">
                Ocurrió un error al obtener las carreras: {error?.message || "Error desconocido"}
              </p>
            )}

            {!isLoading && !isError && carrerasFiltradas.length === 0 && (
              <p className="text-sm font-medium text-slate-400 dark:text-neutro-500">
                No hay carreras registradas.
              </p>
            )}

            <motion.div layout className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {carrerasFiltradas.map((carrera, indice) => (
                <TarjetaAnimada
                  key={carrera.CarreraID}
                  layout
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, ease: "easeOut", delay: indice * 0.02 }}
                  whileHover={{ y: -6, scale: 1.01 }}
                  className="flex flex-col gap-4 rounded-2xl border border-slate-100 bg-white/90 p-5 shadow-md shadow-slate-200/60 transition hover:shadow-lg dark:border-oscuro-300/70 dark:bg-oscuro-200/70 dark:shadow-black/20 dark:hover:border-esmeralda-500/40"
                >
                  <div className="space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400 dark:text-neutro-500">
                      ID {carrera.CarreraID}
                    </p>
                    <h4 className="text-lg font-semibold text-slate-900 dark:text-neutro-50">
                      {carrera.Nombre}
                    </h4>
                    <p className="text-sm font-medium text-primario-500 dark:text-esmeralda-400">
                      {carrera.Clave}
                    </p>
                    {carrera.Descripcion && (
                      <p className="text-sm text-slate-500 dark:text-neutro-300">
                        {carrera.Descripcion}
                      </p>
                    )}
                  </div>

                  <div className="mt-auto flex items-center justify-between text-xs font-semibold uppercase tracking-wide">
                    <span
                      className={`rounded-full px-3 py-1 text-[11px] ${
                        carrera.Activo
                          ? "bg-esmeralda-500/10 text-esmeralda-600 dark:bg-esmeralda-500/20 dark:text-esmeralda-400"
                          : "bg-rose-500/10 text-rose-500 dark:bg-rose-500/20 dark:text-rose-300"
                      }`}
                    >
                      {carrera.Activo ? "Activa" : "Inactiva"}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        className="texto-accion"
                        onClick={() => {
                          definirCarreraEnEdicion(carrera);
                          definirValoresFormulario({
                            Clave: carrera.Clave,
                            Nombre: carrera.Nombre,
                            Descripcion: carrera.Descripcion ?? "",
                            Activo: Boolean(carrera.Activo),
                          });
                        }}
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        className="texto-accion texto-accion--peligro"
                        disabled={accionEliminarCarrera.isPending}
                        onClick={() => accionEliminarCarrera.mutate(carrera.CarreraID)}
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

export default Carreras;
