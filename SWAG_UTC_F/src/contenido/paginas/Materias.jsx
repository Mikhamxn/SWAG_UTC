import React, { useMemo, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  actualizarMateria,
  crearMateria,
  eliminarMateria,
  obtenerMaterias,
} from "../../services/materiasService";

const ContenedorAnimado = motion.section;
const TarjetaAnimada = motion.article;

const esquemaValidacion = Yup.object({
  Nombre: Yup.string()
    .trim()
    .max(100, "El nombre no debe superar 100 caracteres")
    .required("El nombre es obligatorio"),
  Descripcion: Yup.string()
    .trim()
    .max(255, "La descripción no debe superar 255 caracteres")
    .required("La descripción es obligatoria"),
  Activo: Yup.boolean(),
});

const valoresPorDefecto = {
  Nombre: "",
  Descripcion: "",
  Activo: true,
};

const Materias = () => {
  const clienteQuery = useQueryClient();
  const [terminoBusqueda, setTerminoBusqueda] = useState("");
  const [materiaEnEdicion, setMateriaEnEdicion] = useState(null);
  const [valoresFormulario, setValoresFormulario] = useState(valoresPorDefecto);

  const {
    data: materias = { datos: [] },
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["materias"],
    queryFn: obtenerMaterias,
    staleTime: 1000 * 60,
  });

  const accionCrearMateria = useMutation({
    mutationFn: crearMateria,
    onSuccess: () => {
      clienteQuery.invalidateQueries({ queryKey: ["materias"] });
    },
  });

  const accionActualizarMateria = useMutation({
    mutationFn: ({ id, datos }) => actualizarMateria(id, datos),
    onSuccess: () => {
      clienteQuery.invalidateQueries({ queryKey: ["materias"] });
    },
  });

  const accionEliminarMateria = useMutation({
    mutationFn: (id) => eliminarMateria(id),
    onSuccess: () => {
      clienteQuery.invalidateQueries({ queryKey: ["materias"] });
    },
  });

  const materiasFiltradas = useMemo(() => {
    const lista = materias?.datos ?? [];
    const termino = terminoBusqueda.trim().toLowerCase();
    if (!termino) return lista;
    return lista.filter((materia) =>
      [materia?.Nombre, materia?.Descripcion]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(termino))
    );
  }, [materias, terminoBusqueda]);

  const limpiarFormulario = (helpers) => {
    helpers.resetForm({ values: valoresPorDefecto });
    helpers.setStatus(undefined);
    setValoresFormulario(valoresPorDefecto);
    setMateriaEnEdicion(null);
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
            <h2 className="titulo-seccion">Gestión de materias</h2>
            <p className="descripcion-suave mt-2 max-w-2xl">
              Crea, edita y administra las materias disponibles para asignación académica.
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
                {materiaEnEdicion ? "Editar materia" : "Registrar nueva materia"}
              </h3>
              <p className="mt-1 text-sm text-slate-500 dark:text-neutro-300">
                {materiaEnEdicion
                  ? "Actualiza la información y guarda los cambios."
                  : "Completa los campos y guarda para añadirla al catálogo."}
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
                if (materiaEnEdicion) {
                  await accionActualizarMateria.mutateAsync({
                    id: materiaEnEdicion.MateriaID,
                    datos: valores,
                  });
                  helpers.setStatus({ exito: "Materia actualizada correctamente." });
                } else {
                  await accionCrearMateria.mutateAsync(valores);
                  helpers.setStatus({ exito: "Materia registrada correctamente." });
                }
                limpiarFormulario(helpers);
              } catch (e) {
                console.error("No se pudo guardar la materia", e);
                helpers.setStatus({
                  fallo:
                    "No fue posible guardar la materia. Verifica la información e inténtalo nuevamente.",
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
                    placeholder="Ej. Álgebra Lineal"
                  />
                  <ErrorMessage name="Nombre" component="p" className="mensaje-error" />
                </div>

                <div className="campo-formulario">
                  <label className="etiqueta-formulario" htmlFor="Descripcion">
                    Descripción
                  </label>
                  <Field
                    as="textarea"
                    id="Descripcion"
                    name="Descripcion"
                    rows={4}
                    className="input-formulario resize-none"
                    placeholder="Describe brevemente el contenido de la materia"
                  />
                  <ErrorMessage name="Descripcion" component="p" className="mensaje-error" />
                </div>

                <div className="flex items-center gap-3 rounded-xl bg-slate-50 px-3 py-3 text-sm font-medium text-slate-600 dark:bg-oscuro-200/80 dark:text-neutro-200">
                  <Field
                    id="Activo"
                    name="Activo"
                    type="checkbox"
                    checked={values.Activo}
                    onChange={(e) => setFieldValue("Activo", e.target.checked)}
                    className="h-5 w-5 rounded border-slate-300 text-primario-500 focus:ring-primario-500 dark:border-oscuro-300 dark:bg-oscuro-100"
                  />
                  <label htmlFor="Activo">Materia activa para asignaciones</label>
                </div>

                <div className="flex flex-col gap-3 pt-2">
                  <button
                    type="submit"
                    className="boton-principal w-full"
                    disabled={
                      isSubmitting ||
                      accionCrearMateria.isPending ||
                      accionActualizarMateria.isPending
                    }
                  >
                    {materiaEnEdicion
                      ? accionActualizarMateria.isPending
                        ? "Actualizando..."
                        : "Actualizar materia"
                      : accionCrearMateria.isPending
                      ? "Guardando..."
                      : "Guardar materia"}
                  </button>

                  {materiaEnEdicion && (
                    <button
                      type="button"
                      className="boton-secundario w-full"
                      onClick={() => {
                        resetForm({ values: valoresPorDefecto });
                        setMateriaEnEdicion(null);
                        setValoresFormulario(valoresPorDefecto);
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
                  Catálogo de materias
                </h3>
                <p className="text-sm text-slate-500 dark:text-neutro-300">
                  Consulta y administra todas las materias activas del sistema.
                </p>
              </div>
              <div className="relative w-full sm:w-64">
                <input
                  type="search"
                  value={terminoBusqueda}
                  onChange={(e) => setTerminoBusqueda(e.target.value)}
                  placeholder="Buscar por nombre o descripción..."
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 pr-10 text-sm font-medium text-slate-600 shadow-sm transition focus:border-primario-500 focus:outline-none focus:ring-2 focus:ring-primario-500/30 dark:border-oscuro-300 dark:bg-oscuro-200/60 dark:text-neutro-200 dark:focus:border-esmeralda-500 dark:focus:ring-esmeralda-500/30"
                />
              </div>
            </div>
          </div>

          <div className="space-y-6 px-6 py-6">
            {isLoading && (
              <p className="text-sm text-slate-500 dark:text-neutro-300">Cargando materias...</p>
            )}

            {isError && (
              <p className="mensaje-estado mensaje-fallo">
                Ocurrió un error al obtener las materias: {error?.message || "Error desconocido"}
              </p>
            )}

            {!isLoading && !isError && materiasFiltradas.length === 0 && (
              <p className="text-sm font-medium text-slate-400 dark:text-neutro-500">
                No hay materias registradas.
              </p>
            )}

            <motion.div layout className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {materiasFiltradas.map((materia, indice) => (
                <TarjetaAnimada
                  key={materia.MateriaID}
                  layout
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, ease: "easeOut", delay: indice * 0.02 }}
                  whileHover={{ y: -6, scale: 1.01 }}
                  className="flex flex-col gap-4 rounded-2xl border border-slate-100 bg-white/90 p-5 shadow-md shadow-slate-200/60 transition hover:shadow-lg dark:border-oscuro-300/70 dark:bg-oscuro-200/70 dark:shadow-black/20 dark:hover:border-esmeralda-500/40"
                >
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400 dark:text-neutro-500">
                      ID {materia.MateriaID}
                    </p>
                    <h4 className="mt-3 text-lg font-semibold text-slate-900 dark:text-neutro-50">
                      {materia.Nombre}
                    </h4>
                    <p className="mt-2 text-sm font-medium text-slate-500 dark:text-neutro-300">
                      {materia.Descripcion}
                    </p>
                  </div>

                  <div className="mt-auto flex items-center justify-between text-xs font-semibold uppercase tracking-wide">
                    <span
                      className={`rounded-full px-3 py-1 text-[11px] ${
                        materia.Activo
                          ? "bg-esmeralda-500/10 text-esmeralda-600 dark:bg-esmeralda-500/20 dark:text-esmeralda-400"
                          : "bg-rose-500/10 text-rose-500 dark:bg-rose-500/20 dark:text-rose-300"
                      }`}
                    >
                      {materia.Activo ? "Activa" : "Inactiva"}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        className="texto-accion"
                        onClick={() => {
                          setMateriaEnEdicion(materia);
                          setValoresFormulario({
                            Nombre: materia.Nombre ?? "",
                            Descripcion: materia.Descripcion ?? "",
                            Activo: Boolean(materia.Activo),
                          });
                        }}
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        className="texto-accion texto-accion--peligro"
                        disabled={accionEliminarMateria.isPending}
                        onClick={() => {
                          if (confirm("¿Eliminar esta materia? Esta acción no se puede deshacer.")) {
                            accionEliminarMateria.mutate(materia.MateriaID);
                          }
                        }}
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                </TarjetaAnimada>
              )) ||  <p>No hay materias disponibles.</p>}
            </motion.div>
          </div>
        </motion.section>
      </div>
    </ContenedorAnimado>
  );
};

export default Materias;
