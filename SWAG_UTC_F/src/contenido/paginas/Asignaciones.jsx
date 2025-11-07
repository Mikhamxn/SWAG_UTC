import React, { useMemo, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  obtenerAsignaciones,
  crearAsignacion,
  actualizarAsignacion,
  eliminarAsignacion,
} from "../../services/asignacionesService";
import { obtenerMaterias } from "../../services/materiasService";
import { obtenerProfesores } from "../../services/profesoresService";
import { obtenerGrupos } from "../../services/gruposService";

const ContenedorAnimado = motion.section;
const TarjetaAnimada = motion.article;

const diasSemana = [
  { valor: "Lunes", etiqueta: "Lunes" },
  { valor: "Martes", etiqueta: "Martes" },
  { valor: "Miércoles", etiqueta: "Miércoles" },
  { valor: "Jueves", etiqueta: "Jueves" },
  { valor: "Viernes", etiqueta: "Viernes" },
  { valor: "Sábado", etiqueta: "Sábado" },
];

const esquemaValidacion = Yup.object({
  MateriaID: Yup.number().typeError("Selecciona una materia").required("La materia es obligatoria"),
  GrupoID: Yup.string().trim().required("El grupo es obligatorio"),
  ProfesorID: Yup.number().typeError("Selecciona un profesor").required("El profesor es obligatorio"),
  DiaSemana: Yup.string().trim().required("El día es obligatorio"),
  HoraInicio: Yup.string().trim().required("La hora de inicio es obligatoria"),
  HoraFin: Yup.string().trim().required("La hora de fin es obligatoria"),
  CodigoQRClase: Yup.string().trim().max(100, "El código QR no debe superar 100 caracteres").nullable(),
  Activo: Yup.boolean(),
});

const valoresPorDefecto = {
  MateriaID: "",
  GrupoID: "",
  ProfesorID: "",
  DiaSemana: "Lunes",
  HoraInicio: "17:00",
  HoraFin: "17:45",
  CodigoQRClase: "",
  Activo: true,
};

const transformarDatos = (valores) => ({
  ...valores,
  MateriaID: Number(valores.MateriaID),
  GrupoID: Number(valores.GrupoID),
  ProfesorID: Number(valores.ProfesorID),
  CodigoQRClase: valores.CodigoQRClase?.trim() || null,
});

const obtenerEtiquetaProfesor = (profesor) =>
  profesor ? `${profesor.Nombre} ${profesor.Apellido}` : "Profesor sin nombre";

const Asignaciones = () => {
  const clienteQuery = useQueryClient();
  const [terminoBusqueda, establecerTerminoBusqueda] = useState("");
  const [asignacionEnEdicion, establecerAsignacionEnEdicion] = useState(null);
  const [valoresFormulario, establecerValoresFormulario] = useState(valoresPorDefecto);

  const {
    data: asignaciones = { datos: [] },
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["asignaciones"],
    queryFn: obtenerAsignaciones,
    staleTime: 1000 * 60,
  });

  const { data: materias = { datos: [] } } = useQuery({
    queryKey: ["materias"],
    queryFn: obtenerMaterias,
    staleTime: 1000 * 60,
  });

  const { data: profesores = { datos: [] } } = useQuery({
    queryKey: ["profesores"],
    queryFn: obtenerProfesores,
    staleTime: 1000 * 60,
  });

  const {
    data: gruposCatalogo = { datos: [] },
    isLoading: cargandoGrupos,
    isError: errorGruposCatalogo,
  } = useQuery({
    queryKey: ["grupos"],
    queryFn: obtenerGrupos,
    staleTime: 1000 * 60,
  });

  const accionCrearAsignacion = useMutation({
    mutationFn: (datos) => crearAsignacion(transformarDatos(datos)),
    onSuccess: () => {
      clienteQuery.invalidateQueries({ queryKey: ["asignaciones"] });
    },
  });

  const accionActualizarAsignacion = useMutation({
    mutationFn: ({ id, datos }) => actualizarAsignacion(id, transformarDatos(datos)),
    onSuccess: () => {
      clienteQuery.invalidateQueries({ queryKey: ["asignaciones"] });
    },
  });

  const accionEliminarAsignacion = useMutation({
    mutationFn: (id) => eliminarAsignacion(id),
    onSuccess: () => {
      clienteQuery.invalidateQueries({ queryKey: ["asignaciones"] });
    },
  });

  const asignacionesFiltradas = useMemo(() => {
    const lista = asignaciones?.datos ?? [];
    if (!terminoBusqueda.trim()) {
      return lista;
    }
    const termino = terminoBusqueda.trim().toLowerCase();
    return lista.filter((asignacion) => {
      const materia = asignacion.Materia?.Nombre ?? "";
      const profesor = obtenerEtiquetaProfesor(asignacion.Profesor ?? {});
      const grupo = asignacion.Grupo?.Nombre ?? asignacion.Grupo?.Clave ?? String(asignacion.GrupoID ?? "");
      const carrera = asignacion.Grupo?.Carrera?.Nombre ?? asignacion.Grupo?.Carrera?.Clave ?? "";
      return [materia, profesor, asignacion.DiaSemana, grupo, carrera]
        .filter(Boolean)
        .some((valor) => valor.toLowerCase().includes(termino));
    });
  }, [asignaciones, terminoBusqueda]);

  const limpiarFormulario = (helpers) => {
    helpers.resetForm({ values: valoresPorDefecto });
    helpers.setStatus(undefined);
    establecerValoresFormulario(valoresPorDefecto);
    establecerAsignacionEnEdicion(null);
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
            <h2 className="titulo-seccion">Asignaciones de horario</h2>
            <p className="descripcion-suave mt-2 max-w-2xl">
              Vincula materias, profesores y horarios para construir el calendario académico institucional.
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
                {asignacionEnEdicion ? "Editar asignación" : "Crear nueva asignación"}
              </h3>
              <p className="mt-1 text-sm text-slate-500 dark:text-neutro-300">
                {asignacionEnEdicion
                  ? "Actualiza el horario seleccionado y guarda los cambios."
                  : "Selecciona materia, profesor y horario para generar la asignación."}
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
                if (asignacionEnEdicion) {
                  await accionActualizarAsignacion.mutateAsync({
                    id: asignacionEnEdicion.HorarioID,
                    datos: valores,
                  });
                  helpers.setStatus({ exito: "Asignación actualizada correctamente." });
                } else {
                  await accionCrearAsignacion.mutateAsync(valores);
                  helpers.setStatus({ exito: "Asignación creada correctamente." });
                }
                limpiarFormulario(helpers);
              } catch (errorCapturado) {
                console.error("No se pudo guardar la asignación", errorCapturado);
                helpers.setStatus({
                  fallo:
                    "No fue posible guardar la asignación. Verifica la información e inténtalo nuevamente.",
                });
              }
            }}
          >
            {({ isSubmitting, status, setFieldValue, values, resetForm }) => (
              <Form className="mt-6 space-y-5">
                <div className="campo-formulario">
                  <label className="etiqueta-formulario" htmlFor="MateriaID">
                    Materia
                  </label>
                  <Field
                    as="select"
                    id="MateriaID"
                    name="MateriaID"
                    className="input-formulario"
                  >
                    <option value="">Selecciona una materia</option>
                    {(materias?.datos ?? []).map((materia) => (
                      <option key={materia.MateriaID} value={materia.MateriaID}>
                        {materia.Nombre}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage name="MateriaID" component="p" className="mensaje-error" />
                </div>

                <div className="campo-formulario">
                  <label className="etiqueta-formulario" htmlFor="GrupoID">
                    Grupo
                  </label>
                  <Field
                    as="select"
                    id="GrupoID"
                    name="GrupoID"
                    className="input-formulario"
                    disabled={cargandoGrupos || errorGruposCatalogo}
                  >
                    <option value="">Selecciona un grupo</option>
                    {(gruposCatalogo?.datos ?? []).map((grupo) => (
                      <option key={grupo.GrupoID} value={grupo.GrupoID}>
                        {grupo.Clave} · {grupo.Nombre}
                        {grupo.Carrera?.Clave ? ` · ${grupo.Carrera.Clave}` : ""}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage name="GrupoID" component="p" className="mensaje-error" />
                </div>

                <div className="campo-formulario">
                  <label className="etiqueta-formulario" htmlFor="ProfesorID">
                    Profesor
                  </label>
                  <Field
                    as="select"
                    id="ProfesorID"
                    name="ProfesorID"
                    className="input-formulario"
                  >
                    <option value="">Selecciona un profesor</option>
                    {(profesores?.datos ?? []).map((profesor) => (
                      <option key={profesor.ProfesorID} value={profesor.ProfesorID}>
                        {profesor.Nombre} {profesor.Apellido}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage name="ProfesorID" component="p" className="mensaje-error" />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="campo-formulario">
                    <label className="etiqueta-formulario" htmlFor="DiaSemana">
                      Día de la semana
                    </label>
                    <Field as="select" id="DiaSemana" name="DiaSemana" className="input-formulario">
                      {diasSemana.map((dia) => (
                        <option key={dia.valor} value={dia.valor}>
                          {dia.etiqueta}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage name="DiaSemana" component="p" className="mensaje-error" />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="campo-formulario">
                      <label className="etiqueta-formulario" htmlFor="HoraInicio">
                        Hora de inicio
                      </label>
                      <Field id="HoraInicio" name="HoraInicio" type="time" className="input-formulario" />
                      <ErrorMessage name="HoraInicio" component="p" className="mensaje-error" />
                    </div>
                    <div className="campo-formulario">
                      <label className="etiqueta-formulario" htmlFor="HoraFin">
                        Hora de fin
                      </label>
                      <Field id="HoraFin" name="HoraFin" type="time" className="input-formulario" />
                      <ErrorMessage name="HoraFin" component="p" className="mensaje-error" />
                    </div>
                  </div>
                </div>

                <div className="campo-formulario">
                  <label className="etiqueta-formulario" htmlFor="CodigoQRClase">
                    Código QR de la clase (opcional)
                  </label>
                  <Field
                    id="CodigoQRClase"
                    name="CodigoQRClase"
                    type="text"
                    className="input-formulario"
                    placeholder="URL o identificador de la sesión"
                  />
                  <ErrorMessage name="CodigoQRClase" component="p" className="mensaje-error" />
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
                  <label htmlFor="Activo">Asignación activa</label>
                </div>

                <div className="flex flex-col gap-3 pt-2">
                  <button
                    type="submit"
                    className="boton-principal w-full"
                    disabled={
                      isSubmitting ||
                      accionCrearAsignacion.isPending ||
                      accionActualizarAsignacion.isPending
                    }
                  >
                    {asignacionEnEdicion
                      ? accionActualizarAsignacion.isPending
                        ? "Actualizando..."
                        : "Actualizar asignación"
                      : accionCrearAsignacion.isPending
                      ? "Guardando..."
                      : "Guardar asignación"}
                  </button>

                  {asignacionEnEdicion && (
                    <button
                      type="button"
                      className="boton-secundario w-full"
                      onClick={() => {
                        resetForm({ values: valoresPorDefecto });
                        establecerAsignacionEnEdicion(null);
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
                  Calendario de asignaciones
                </h3>
                <p className="text-sm text-slate-500 dark:text-neutro-300">
                  Revisa o ajusta las combinaciones materia-profesor-horario activas.
                </p>
              </div>
              <div className="relative w-full sm:w-64">
                <input
                  type="search"
                  value={terminoBusqueda}
                  onChange={(evento) => establecerTerminoBusqueda(evento.target.value)}
                  placeholder="Buscar por materia, profesor o grupo..."
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
              <p className="text-sm text-slate-500 dark:text-neutro-300">Cargando asignaciones...</p>
            )}

            {isError && (
              <p className="mensaje-estado mensaje-fallo">
                Ocurrió un error al obtener las asignaciones: {error?.message || "Error desconocido"}
              </p>
            )}

            {!isLoading && !isError && asignacionesFiltradas.length === 0 && (
              <p className="text-sm font-medium text-slate-400 dark:text-neutro-500">
                No hay asignaciones registradas.
              </p>
            )}

            <motion.div layout className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {asignacionesFiltradas.map((asignacion, indice) => (
                <TarjetaAnimada
                  key={asignacion.HorarioID}
                  layout
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, ease: "easeOut", delay: indice * 0.02 }}
                  whileHover={{ y: -6, scale: 1.01 }}
                  className="flex flex-col gap-4 rounded-2xl border border-slate-100 bg-white/90 p-5 shadow-md shadow-slate-200/60 transition hover:shadow-lg dark:border-oscuro-300/70 dark:bg-oscuro-200/70 dark:shadow-black/20 dark:hover:border-esmeralda-500/40"
                >
                  <div className="space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400 dark:text-neutro-500">
                      ID {asignacion.HorarioID}
                    </p>
                    <h4 className="text-lg font-semibold text-slate-900 dark:text-neutro-50">
                      {asignacion.Materia?.Nombre ?? "Materia sin nombre"}
                    </h4>
                    <p className="text-sm font-medium text-slate-500 dark:text-neutro-300">
                      {obtenerEtiquetaProfesor(asignacion.Profesor)}
                    </p>
                    <div className="text-sm font-medium text-slate-500 dark:text-neutro-300">
                      <p>
                        {asignacion.Grupo?.Nombre
                          ? `${asignacion.Grupo.Nombre} · ${asignacion.Grupo.Clave}`
                          : `Grupo ${asignacion.GrupoID}`}
                      </p>
                      {asignacion.Grupo?.Carrera && (
                        <p className="text-xs font-semibold text-primario-500 dark:text-esmeralda-400">
                          {asignacion.Grupo.Carrera.Nombre} · {asignacion.Grupo.Carrera.Clave}
                        </p>
                      )}
                      <p>
                        {asignacion.DiaSemana} · {asignacion.HoraInicio?.slice(0, 5)} - {asignacion.HoraFin?.slice(0, 5)}
                      </p>
                    </div>
                    {asignacion.CodigoQRClase && (
                      <p className="truncate text-xs font-medium text-slate-400 dark:text-neutro-400">
                        QR: {asignacion.CodigoQRClase}
                      </p>
                    )}
                  </div>

                  <div className="mt-auto flex items-center justify-between text-xs font-semibold uppercase tracking-wide">
                    <span
                      className={`rounded-full px-3 py-1 text-[11px] ${
                        asignacion.Activo
                          ? "bg-esmeralda-500/10 text-esmeralda-600 dark:bg-esmeralda-500/20 dark:text-esmeralda-400"
                          : "bg-rose-500/10 text-rose-500 dark:bg-rose-500/20 dark:text-rose-300"
                      }`}
                    >
                      {asignacion.Activo ? "Activa" : "Inactiva"}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        className="texto-accion"
                        onClick={() => {
                          establecerAsignacionEnEdicion(asignacion);
                          establecerValoresFormulario({
                            MateriaID: String(asignacion.MateriaID),
                            GrupoID: String(asignacion.GrupoID),
                            ProfesorID: String(asignacion.ProfesorID),
                            DiaSemana: asignacion.DiaSemana,
                            HoraInicio: asignacion.HoraInicio?.slice(0, 5) ?? "",
                            HoraFin: asignacion.HoraFin?.slice(0, 5) ?? "",
                            CodigoQRClase: asignacion.CodigoQRClase ?? "",
                            Activo: Boolean(asignacion.Activo),
                          });
                        }}
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        className="texto-accion texto-accion--peligro"
                        disabled={accionEliminarAsignacion.isPending}
                        onClick={() => accionEliminarAsignacion.mutate(asignacion.HorarioID)}
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

export default Asignaciones;
