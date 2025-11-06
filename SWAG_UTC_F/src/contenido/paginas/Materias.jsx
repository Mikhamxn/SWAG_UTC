import React, { useMemo, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { crearMateria, obtenerMaterias } from "../../services/materiasService";

const ContenedorAnimado = motion.section;
const TarjetaAnimada = motion.article;

const esquemaValidacion = Yup.object({
  strClave: Yup.string()
    .trim()
    .max(16, "La clave no debe superar 16 caracteres")
    .required("La clave es obligatoria"),
  strNombre: Yup.string()
    .trim()
    .max(120, "El nombre no debe superar 120 caracteres")
    .required("El nombre es obligatorio"),
  intTotalSesiones: Yup.number()
    .typeError("Ingresa un total de sesiones válido")
    .integer("Solo números enteros")
    .min(1, "Debe ser al menos 1 sesión")
    .max(200, "No debe exceder 200 sesiones")
    .required("El total de sesiones es obligatorio"),
});

const Materias = () => {
  const clienteQuery = useQueryClient();
  const [terminoBusqueda, establecerTerminoBusqueda] = useState("");

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
    mutationFn: async (valores) => {
      const carga = {
        ...valores,
        intTotalSesiones: Number(valores.intTotalSesiones),
      };
      return crearMateria(carga);
    },
    onSuccess: () => {
      clienteQuery.invalidateQueries({ queryKey: ["materias"] });
    },
  });

  const materiasFiltradas = useMemo(() => {
    const lista = materias?.datos ?? [];
    if (!terminoBusqueda.trim()) {
      return lista;
    }
    const termino = terminoBusqueda.trim().toLowerCase();
    return lista.filter((materia) =>
      [materia.strClave, materia.strNombre]
        .filter(Boolean)
        .some((valor) => valor.toLowerCase().includes(termino))
    );
  }, [materias, terminoBusqueda]);

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
              Registra nuevas materias y visualiza el catálogo actualizado desde la base de datos institucional.
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
          <h3 className="text-lg font-semibold text-slate-900 dark:text-neutro-50">Registrar nueva materia</h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-neutro-300">
            Completa los campos y guarda para añadirla al catálogo.
          </p>

          <Formik
            initialValues={{
              strClave: "",
              strNombre: "",
              intTotalSesiones: "",
            }}
            validationSchema={esquemaValidacion}
            onSubmit={async (valores, helpers) => {
              helpers.setStatus(undefined);
              try {
                await accionCrearMateria.mutateAsync(valores);
                helpers.resetForm();
                helpers.setStatus({ exito: "Materia registrada correctamente." });
              } catch (errorCapturado) {
                console.error("No se pudo crear la materia", errorCapturado);
                helpers.setStatus({
                  fallo:
                    "No fue posible registrar la materia. Verifica la información e inténtalo nuevamente.",
                });
              }
            }}
          >
            {({ isSubmitting, status }) => (
              <Form className="mt-6 space-y-5">
                <div className="campo-formulario">
                  <label className="etiqueta-formulario" htmlFor="strClave">
                    Clave
                  </label>
                  <Field
                    id="strClave"
                    name="strClave"
                    type="text"
                    className="input-formulario"
                    placeholder="Ej. MAT101"
                  />
                  <ErrorMessage name="strClave" component="p" className="mensaje-error" />
                </div>

                <div className="campo-formulario">
                  <label className="etiqueta-formulario" htmlFor="strNombre">
                    Nombre
                  </label>
                  <Field
                    id="strNombre"
                    name="strNombre"
                    type="text"
                    className="input-formulario"
                    placeholder="Nombre de la materia"
                  />
                  <ErrorMessage name="strNombre" component="p" className="mensaje-error" />
                </div>

                <div className="campo-formulario">
                  <label className="etiqueta-formulario" htmlFor="intTotalSesiones">
                    Total de sesiones
                  </label>
                  <Field
                    id="intTotalSesiones"
                    name="intTotalSesiones"
                    type="number"
                    min="1"
                    className="input-formulario"
                    placeholder="Ej. 40"
                  />
                  <ErrorMessage
                    name="intTotalSesiones"
                    component="p"
                    className="mensaje-error"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="boton-principal w-full"
                    disabled={isSubmitting || accionCrearMateria.isPending}
                  >
                    {accionCrearMateria.isPending ? "Guardando..." : "Guardar materia"}
                  </button>
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
                <h3 className="text-lg font-semibold text-slate-900 dark:text-neutro-50">Catálogo de materias</h3>
                <p className="text-sm text-slate-500 dark:text-neutro-300">
                  Consulta todas las materias disponibles en el sistema.
                </p>
              </div>
              <div className="relative w-full sm:w-64">
                <input
                  type="search"
                  value={terminoBusqueda}
                  onChange={(evento) => establecerTerminoBusqueda(evento.target.value)}
                  placeholder="Buscar materias..."
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 pr-10 text-sm font-medium text-slate-600 shadow-sm transition focus:border-primario-500 focus:outline-none focus:ring-2 focus:ring-primario-500/30 dark:border-oscuro-300 dark:bg-oscuro-200/60 dark:text-neutro-200 dark:focus:border-esmeralda-500 dark:focus:ring-esmeralda-500/30"
                />
                <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-400 dark:text-neutro-500">
                  🔍
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-6 px-6 py-6">
            {isLoading && <p className="text-sm text-slate-500 dark:text-neutro-300">Cargando materias...</p>}

            {isError && (
              <p className="mensaje-estado mensaje-fallo">
                Ocurrió un error al obtener las materias: {error?.message || "Error desconocido"}
              </p>
            )}

            {!isLoading && !isError && materiasFiltradas.length === 0 && (
              <p className="text-sm font-medium text-slate-400 dark:text-neutro-500">No hay materias registradas.</p>
            )}

            <motion.div
              layout
              className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
            >
              {materiasFiltradas.map((materia, indice) => (
                <TarjetaAnimada
                  key={materia.intMateria || materia.id || materia.strClave || indice}
                  layout
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, ease: "easeOut", delay: indice * 0.02 }}
                  whileHover={{ y: -6, scale: 1.01 }}
                  className="rounded-2xl border border-slate-100 bg-white/90 p-5 shadow-md shadow-slate-200/60 transition hover:shadow-lg dark:border-oscuro-300/70 dark:bg-oscuro-200/70 dark:shadow-black/20 dark:hover:border-esmeralda-500/40"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-400 dark:text-neutro-500">
                    {materia.strClave}
                  </p>
                  <h4 className="mt-3 text-lg font-semibold text-slate-900 dark:text-neutro-50">
                    {materia.strNombre}
                  </h4>
                  <p className="mt-2 text-sm font-medium text-slate-500 dark:text-neutro-300">
                    Sesiones: {materia.intTotalSesiones ?? "N/D"}
                  </p>
                </TarjetaAnimada>
              ))}
            </motion.div>
          </div>
        </motion.section>
      </div>
    </ContenedorAnimado>
  );
};

export default Materias;
