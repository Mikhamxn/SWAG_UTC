import React, { useEffect, useMemo, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  obtenerGrupos,
  crearGrupo,
  actualizarGrupo,
  eliminarGrupo,
} from "../../services/gruposService";
import { obtenerCarreras } from "../../services/carrerasService";
import { obtenerAlumnos } from "../../services/alumnosService";
import {
  obtenerGrupoAlumnos,
  asignarAlumnoAGrupo,
  eliminarGrupoAlumno,
} from "../../services/grupoAlumnosService";

const ContenedorAnimado = motion.section;
const TarjetaAnimada = motion.article;

const TURNOS = [
  { valor: "Matutino", etiqueta: "Matutino" },
  { valor: "Vespertino", etiqueta: "Vespertino" },
  { valor: "Nocturno", etiqueta: "Nocturno" },
  { valor: "Mixto", etiqueta: "Mixto" },
];

const esquemaValidacion = Yup.object({
  CarreraID: Yup.string().required("Selecciona una carrera"),
  Clave: Yup.string()
    .trim()
    .max(20, "La clave no debe superar 20 caracteres")
    .required("La clave es obligatoria"),
  Nombre: Yup.string()
    .trim()
    .max(120, "El nombre no debe superar 120 caracteres")
    .required("El nombre es obligatorio"),
  Turno: Yup.string().trim().max(20, "El turno no debe superar 20 caracteres").required("El turno es obligatorio"),
  Activo: Yup.boolean(),
});

const valoresPorDefecto = {
  CarreraID: "",
  Clave: "",
  Nombre: "",
  Turno: "",
  Activo: true,
};

const Grupos = () => {
  const clienteQuery = useQueryClient();
  const [terminoBusqueda, definirTerminoBusqueda] = useState("");
  const [grupoEnEdicion, definirGrupoEnEdicion] = useState(null);
  const [valoresFormulario, definirValoresFormulario] = useState(valoresPorDefecto);
  const [grupoSeleccionado, definirGrupoSeleccionado] = useState(null);
  const [alumnoAAsignar, definirAlumnoAAsignar] = useState("");
  const [mensajeAsignacion, definirMensajeAsignacion] = useState(null);

  const {
    data: grupos = { datos: [] },
    isLoading: cargandoGrupos,
    isError: errorGrupos,
    error: detalleErrorGrupos,
  } = useQuery({
    queryKey: ["grupos"],
    queryFn: obtenerGrupos,
    staleTime: 1000 * 60,
  });

  const {
    data: carreras = { datos: [] },
    isLoading: cargandoCarreras,
    isError: errorCarreras,
  } = useQuery({
    queryKey: ["carreras"],
    queryFn: obtenerCarreras,
    staleTime: 1000 * 60,
  });

  const {
    data: alumnos = { datos: [] },
    isLoading: cargandoAlumnos,
    isError: errorAlumnos,
    error: detalleErrorAlumnos,
  } = useQuery({
    queryKey: ["alumnos"],
    queryFn: obtenerAlumnos,
    staleTime: 1000 * 60,
  });

  const claveAsignaciones = useMemo(
    () => ["grupo-alumnos", grupoSeleccionado?.GrupoID ?? "sin-grupo"],
    [grupoSeleccionado]
  );

  const {
    data: asignacionesGrupo = { datos: [] },
    isLoading: cargandoAsignaciones,
    isError: errorAsignaciones,
    error: detalleErrorAsignaciones,
  } = useQuery({
    queryKey: claveAsignaciones,
    queryFn: () => obtenerGrupoAlumnos({ GrupoID: grupoSeleccionado.GrupoID }),
    enabled: Boolean(grupoSeleccionado),
    staleTime: 1000 * 30,
  });

  const accionCrearGrupo = useMutation({
    mutationFn: crearGrupo,
    onSuccess: () => clienteQuery.invalidateQueries({ queryKey: ["grupos"] }),
  });

  const accionActualizarGrupo = useMutation({
    mutationFn: ({ id, datos }) => actualizarGrupo(id, datos),
    onSuccess: () => clienteQuery.invalidateQueries({ queryKey: ["grupos"] }),
  });

  const accionEliminarGrupo = useMutation({
    mutationFn: (id) => eliminarGrupo(id),
    onSuccess: (_, id) => {
      clienteQuery.invalidateQueries({ queryKey: ["grupos"] });
      if (grupoSeleccionado?.GrupoID === id) {
        definirGrupoSeleccionado(null);
      }
    },
  });

  const obtenerMensajeDeError = (errorCapturado) =>
    errorCapturado?.response?.data?.mensaje || errorCapturado?.message || "Error desconocido";

  const accionAsignarAlumno = useMutation({
    mutationFn: ({ GrupoID, AlumnoID }) =>
      asignarAlumnoAGrupo({ GrupoID, AlumnoID, Activo: true }),
    onSuccess: () => {
      if (grupoSeleccionado) {
        clienteQuery.invalidateQueries({ queryKey: ["grupo-alumnos", grupoSeleccionado.GrupoID] });
      }
      definirAlumnoAAsignar("");
      definirMensajeAsignacion({ tipo: "exito", texto: "Alumno asignado correctamente." });
    },
    onError: (errorCapturado) => {
      definirMensajeAsignacion({
        tipo: "error",
        texto: obtenerMensajeDeError(errorCapturado),
      });
    },
  });

  const accionEliminarAsignacion = useMutation({
    mutationFn: ({ GrupoID, AlumnoID }) => eliminarGrupoAlumno(GrupoID, AlumnoID),
    onSuccess: () => {
      if (grupoSeleccionado) {
        clienteQuery.invalidateQueries({ queryKey: ["grupo-alumnos", grupoSeleccionado.GrupoID] });
      }
      definirMensajeAsignacion({ tipo: "exito", texto: "Alumno eliminado del grupo." });
    },
    onError: (errorCapturado) => {
      definirMensajeAsignacion({
        tipo: "error",
        texto: obtenerMensajeDeError(errorCapturado),
      });
    },
  });

  useEffect(() => {
    definirMensajeAsignacion(null);
    definirAlumnoAAsignar("");
  }, [grupoSeleccionado]);

  useEffect(() => {
    if (!mensajeAsignacion) {
      return undefined;
    }
    const temporizador = setTimeout(() => definirMensajeAsignacion(null), 5000);
    return () => clearTimeout(temporizador);
  }, [mensajeAsignacion]);

  const alumnosCatalogo = useMemo(() => alumnos?.datos ?? [], [alumnos]);
  const asignaciones = useMemo(() => asignacionesGrupo?.datos ?? [], [asignacionesGrupo]);

  const alumnosDisponibles = useMemo(() => {
    const asignados = new Set(asignaciones.map((registro) => registro.AlumnoID));
    return alumnosCatalogo.filter((alumno) => !asignados.has(alumno.AlumnoID));
  }, [alumnosCatalogo, asignaciones]);

  const gruposFiltrados = useMemo(() => {
    const lista = grupos?.datos ?? [];
    if (!terminoBusqueda.trim()) {
      return lista;
    }
    const termino = terminoBusqueda.trim().toLowerCase();
    return lista.filter((grupo) =>
      [grupo.Clave, grupo.Nombre, grupo.Turno, grupo.Carrera?.Nombre, grupo.Carrera?.Clave]
        .filter(Boolean)
        .some((valor) => valor.toLowerCase().includes(termino))
    );
  }, [grupos, terminoBusqueda]);

  const limpiarFormulario = (helpers) => {
    helpers.resetForm({ values: valoresPorDefecto });
    helpers.setStatus(undefined);
    definirValoresFormulario(valoresPorDefecto);
    definirGrupoEnEdicion(null);
  };

  const manejarAsignacion = async () => {
    if (!grupoSeleccionado) {
      return;
    }
    if (!alumnoAAsignar) {
      definirMensajeAsignacion({ tipo: "error", texto: "Selecciona un alumno para asignar." });
      return;
    }
    try {
      await accionAsignarAlumno.mutateAsync({
        GrupoID: grupoSeleccionado.GrupoID,
        AlumnoID: Number(alumnoAAsignar),
      });
    } catch (errorCapturado) {
      console.error("No fue posible asignar al alumno", errorCapturado);
      // onError de la mutación ya muestra el mensaje adecuado
    }
  };

  const carrerasDisponibles = carreras?.datos ?? [];

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
            <h2 className="titulo-seccion">Gestión de grupos</h2>
            <p className="descripcion-suave mt-2 max-w-2xl">
              Crea grupos vinculados a una carrera y define su turno para posteriores asignaciones.
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
                {grupoEnEdicion ? "Editar grupo" : "Registrar nuevo grupo"}
              </h3>
              <p className="mt-1 text-sm text-slate-500 dark:text-neutro-300">
                {grupoEnEdicion
                  ? "Actualiza la información del grupo y guarda los cambios."
                  : "Selecciona la carrera, asigna una clave y define el turno del grupo."}
              </p>
            </div>
          </div>

          <Formik
            enableReinitialize
            initialValues={valoresFormulario}
            validationSchema={esquemaValidacion}
            onSubmit={async (valores, helpers) => {
              helpers.setStatus(undefined);
              const payload = {
                ...valores,
                CarreraID: Number(valores.CarreraID),
              };
              try {
                if (grupoEnEdicion) {
                  await accionActualizarGrupo.mutateAsync({
                    id: grupoEnEdicion.GrupoID,
                    datos: payload,
                  });
                  helpers.setStatus({ exito: "Grupo actualizado correctamente." });
                } else {
                  await accionCrearGrupo.mutateAsync(payload);
                  helpers.setStatus({ exito: "Grupo registrado correctamente." });
                }
                limpiarFormulario(helpers);
              } catch (errorCapturado) {
                console.error("No se pudo guardar el grupo", errorCapturado);
                helpers.setStatus({
                  fallo: "No fue posible guardar el grupo. Verifica la información e inténtalo nuevamente.",
                });
              }
            }}
          >
            {({ isSubmitting, status, values, setFieldValue, resetForm }) => (
              <Form className="mt-6 space-y-5">
                <div className="campo-formulario">
                  <label className="etiqueta-formulario" htmlFor="CarreraID">
                    Carrera
                  </label>
                  <Field
                    as="select"
                    id="CarreraID"
                    name="CarreraID"
                    className="input-formulario"
                    disabled={cargandoCarreras || errorCarreras}
                    onChange={(evento) => setFieldValue("CarreraID", evento.target.value)}
                  >
                    <option value="">Selecciona una carrera</option>
                    {carrerasDisponibles.map((carrera) => (
                      <option key={carrera.CarreraID} value={carrera.CarreraID}>
                        {carrera.Clave} · {carrera.Nombre}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage name="CarreraID" component="p" className="mensaje-error" />
                </div>

                <div className="campo-formulario">
                  <label className="etiqueta-formulario" htmlFor="Clave">
                    Clave del grupo
                  </label>
                  <Field
                    id="Clave"
                    name="Clave"
                    type="text"
                    className="input-formulario"
                    placeholder="Ej. GPO-401"
                  />
                  <ErrorMessage name="Clave" component="p" className="mensaje-error" />
                </div>

                <div className="campo-formulario">
                  <label className="etiqueta-formulario" htmlFor="Nombre">
                    Nombre del grupo
                  </label>
                  <Field
                    id="Nombre"
                    name="Nombre"
                    type="text"
                    className="input-formulario"
                    placeholder="Cuarto cuatrimestre Sistemas"
                  />
                  <ErrorMessage name="Nombre" component="p" className="mensaje-error" />
                </div>

                <div className="campo-formulario">
                  <label className="etiqueta-formulario" htmlFor="Turno">
                    Turno
                  </label>
                  <Field
                    as="select"
                    id="Turno"
                    name="Turno"
                    className="input-formulario"
                    value={values.Turno}
                    onChange={(evento) => setFieldValue("Turno", evento.target.value)}
                  >
                    <option value="">Selecciona el turno</option>
                    {TURNOS.map((turno) => (
                      <option key={turno.valor} value={turno.valor}>
                        {turno.etiqueta}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage name="Turno" component="p" className="mensaje-error" />
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
                  <label htmlFor="Activo">Grupo activo</label>
                </div>

                <div className="flex flex-col gap-3 pt-2">
                  <button
                    type="submit"
                    className="boton-principal w-full"
                    disabled={
                      isSubmitting ||
                      accionCrearGrupo.isPending ||
                      accionActualizarGrupo.isPending ||
                      cargandoCarreras ||
                      errorCarreras
                    }
                  >
                    {grupoEnEdicion
                      ? accionActualizarGrupo.isPending
                        ? "Actualizando..."
                        : "Actualizar grupo"
                      : accionCrearGrupo.isPending
                      ? "Guardando..."
                      : "Guardar grupo"}
                  </button>

                  {grupoEnEdicion && (
                    <button
                      type="button"
                      className="boton-secundario w-full"
                      onClick={() => {
                        resetForm({ values: valoresPorDefecto });
                        definirGrupoEnEdicion(null);
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
                  Directorio de grupos
                </h3>
                <p className="text-sm text-slate-500 dark:text-neutro-300">
                  Visualiza los grupos activos, su turno y la carrera asignada.
                </p>
              </div>
              <div className="relative w-full sm:w-72">
                <input
                  type="search"
                  value={terminoBusqueda}
                  onChange={(evento) => definirTerminoBusqueda(evento.target.value)}
                  placeholder="Buscar por clave, nombre o carrera..."
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 pr-10 text-sm font-medium text-slate-600 shadow-sm transition focus:border-primario-500 focus:outline-none focus:ring-2 focus:ring-primario-500/30 dark:border-oscuro-300 dark:bg-oscuro-200/60 dark:text-neutro-200 dark:focus:border-esmeralda-500 dark:focus:ring-esmeralda-500/30"
                />
                <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-400 dark:text-neutro-500">
                  🔍
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-6 px-6 py-6">
            {cargandoGrupos && (
              <p className="text-sm text-slate-500 dark:text-neutro-300">Cargando grupos...</p>
            )}

            {errorGrupos && (
              <p className="mensaje-estado mensaje-fallo">
                Ocurrió un error al obtener los grupos: {detalleErrorGrupos?.message || "Error desconocido"}
              </p>
            )}

            {!cargandoGrupos && !errorGrupos && gruposFiltrados.length === 0 && (
              <p className="text-sm font-medium text-slate-400 dark:text-neutro-500">
                No hay grupos registrados.
              </p>
            )}

            <motion.div layout className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {gruposFiltrados.map((grupo, indice) => (
                <TarjetaAnimada
                  key={grupo.GrupoID}
                  layout
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, ease: "easeOut", delay: indice * 0.02 }}
                  whileHover={{ y: -6, scale: 1.01 }}
                  className="flex flex-col gap-4 rounded-2xl border border-slate-100 bg-white/90 p-5 shadow-md shadow-slate-200/60 transition hover:shadow-lg dark:border-oscuro-300/70 dark:bg-oscuro-200/70 dark:shadow-black/20 dark:hover:border-esmeralda-500/40"
                >
                  <div className="space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400 dark:text-neutro-500">
                      ID {grupo.GrupoID}
                    </p>
                    <h4 className="text-lg font-semibold text-slate-900 dark:text-neutro-50">
                      {grupo.Nombre}
                    </h4>
                    <p className="text-sm font-medium text-primario-500 dark:text-esmeralda-400">
                      {grupo.Clave}
                    </p>
                    {grupo.Carrera && (
                      <p className="text-sm text-slate-500 dark:text-neutro-300">
                        {grupo.Carrera.Nombre} · {grupo.Carrera.Clave}
                      </p>
                    )}
                    <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:bg-oscuro-300/70 dark:text-neutro-300">
                      Turno {grupo.Turno}
                    </span>
                  </div>

                  <div className="mt-auto flex items-center justify-between text-xs font-semibold uppercase tracking-wide">
                    <span
                      className={`rounded-full px-3 py-1 text-[11px] ${
                        grupo.Activo
                          ? "bg-esmeralda-500/10 text-esmeralda-600 dark:bg-esmeralda-500/20 dark:text-esmeralda-400"
                          : "bg-rose-500/10 text-rose-500 dark:bg-rose-500/20 dark:text-rose-300"
                      }`}
                    >
                      {grupo.Activo ? "Activo" : "Inactivo"}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        className="texto-accion"
                        onClick={() =>
                          definirGrupoSeleccionado((actual) =>
                            actual?.GrupoID === grupo.GrupoID ? null : grupo
                          )
                        }
                      >
                        {grupoSeleccionado?.GrupoID === grupo.GrupoID
                          ? "Cerrar alumnos"
                          : "Gestionar alumnos"}
                      </button>
                      <button
                        type="button"
                        className="texto-accion"
                        onClick={() => {
                          definirGrupoEnEdicion(grupo);
                          definirValoresFormulario({
                            CarreraID: String(grupo.CarreraID ?? grupo.Carrera?.CarreraID ?? ""),
                            Clave: grupo.Clave,
                            Nombre: grupo.Nombre,
                            Turno: grupo.Turno,
                            Activo: Boolean(grupo.Activo),
                          });
                        }}
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        className="texto-accion texto-accion--peligro"
                        disabled={accionEliminarGrupo.isPending}
                        onClick={() => accionEliminarGrupo.mutate(grupo.GrupoID)}
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                </TarjetaAnimada>
              ))}
            </motion.div>

            {grupoSeleccionado && (
              <motion.div
                key={`panel-grupo-${grupoSeleccionado.GrupoID}`}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="rounded-2xl border border-slate-100 bg-white/90 p-6 shadow-md shadow-slate-200/60 dark:border-oscuro-300/70 dark:bg-oscuro-200/70"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400 dark:text-neutro-500">
                      Grupo {grupoSeleccionado.GrupoID}
                    </p>
                    <h4 className="text-lg font-semibold text-slate-900 dark:text-neutro-50">
                      {grupoSeleccionado.Nombre}
                    </h4>
                    <p className="text-sm font-medium text-primario-500 dark:text-esmeralda-400">
                      {grupoSeleccionado.Clave || "Sin clave definida"}
                    </p>
                    <p className="text-xs uppercase tracking-wide text-slate-400 dark:text-neutro-400">
                      Turno {grupoSeleccionado.Turno || "No especificado"}
                    </p>
                  </div>
                  <button
                    type="button"
                    className="texto-accion texto-accion--peligro"
                    onClick={() => definirGrupoSeleccionado(null)}
                  >
                    Cerrar panel
                  </button>
                </div>

                <div className="mt-5 space-y-4">
                  {cargandoAsignaciones && (
                    <p className="text-sm text-slate-500 dark:text-neutro-300">
                      Cargando alumnos asignados...
                    </p>
                  )}

                  {errorAsignaciones && (
                    <p className="mensaje-estado mensaje-fallo">
                      {obtenerMensajeDeError(detalleErrorAsignaciones)}
                    </p>
                  )}

                  {!cargandoAsignaciones && !errorAsignaciones && asignaciones.length === 0 && (
                    <p className="text-sm font-medium text-slate-400 dark:text-neutro-500">
                      El grupo aún no tiene alumnos asignados.
                    </p>
                  )}

                  {!cargandoAsignaciones && !errorAsignaciones && asignaciones.length > 0 && (
                    <ul className="space-y-3">
                      {asignaciones.map((registro) => (
                        <li
                          key={`${registro.GrupoID}-${registro.AlumnoID}`}
                          className="flex flex-col gap-3 rounded-xl border border-slate-200/60 bg-slate-50/80 px-4 py-3 text-sm shadow-sm dark:border-oscuro-300/60 dark:bg-oscuro-300/40 sm:flex-row sm:items-center sm:justify-between"
                        >
                          <div>
                            <p className="text-base font-semibold text-slate-800 dark:text-neutro-100">
                              {registro.Alumno?.Nombre} {registro.Alumno?.Apellido}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-neutro-400">
                              {registro.Alumno?.Email}
                            </p>
                          </div>
                          <div className="flex items-center gap-3">
                            <span
                              className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
                                registro.Activo
                                  ? "bg-esmeralda-500/10 text-esmeralda-600 dark:bg-esmeralda-500/20 dark:text-esmeralda-300"
                                  : "bg-rose-500/10 text-rose-500 dark:bg-rose-500/20 dark:text-rose-300"
                              }`}
                            >
                              {registro.Activo ? "Activo" : "Inactivo"}
                            </span>
                            <button
                              type="button"
                              className="texto-accion texto-accion--peligro"
                              disabled={accionEliminarAsignacion.isPending}
                              onClick={() =>
                                accionEliminarAsignacion.mutate({
                                  GrupoID: registro.GrupoID,
                                  AlumnoID: registro.AlumnoID,
                                })
                              }
                            >
                              Quitar
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="mt-6 border-t border-slate-200 pt-6 dark:border-oscuro-300/60">
                  <h5 className="text-sm font-semibold text-slate-900 dark:text-neutro-100">Agregar alumno</h5>
                  <p className="mt-1 text-xs text-slate-500 dark:text-neutro-400">
                    Selecciona un alumno disponible y asignalo al grupo.
                  </p>

                  <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
                    <select
                      value={alumnoAAsignar}
                      onChange={(evento) => definirAlumnoAAsignar(evento.target.value)}
                      className="input-formulario sm:flex-1"
                      disabled={
                        cargandoAlumnos ||
                        errorAlumnos ||
                        accionAsignarAlumno.isPending ||
                        alumnosDisponibles.length === 0
                      }
                    >
                      <option value="">Selecciona un alumno</option>
                      {alumnosDisponibles.map((alumno) => (
                        <option key={alumno.AlumnoID} value={alumno.AlumnoID}>
                          {alumno.Nombre} {alumno.Apellido} · {alumno.Email}
                        </option>
                      ))}
                    </select>

                    <button
                      type="button"
                      className="boton-principal sm:w-auto"
                      onClick={manejarAsignacion}
                      disabled={
                        accionAsignarAlumno.isPending ||
                        !grupoSeleccionado ||
                        !alumnoAAsignar
                      }
                    >
                      {accionAsignarAlumno.isPending ? "Asignando..." : "Asignar alumno"}
                    </button>
                  </div>

                  {errorAlumnos && (
                    <p className="mensaje-estado mensaje-fallo mt-3">
                      Ocurrió un error al cargar los alumnos: {obtenerMensajeDeError(detalleErrorAlumnos)}
                    </p>
                  )}

                  {mensajeAsignacion && (
                    <p
                      className={`mensaje-estado ${
                        mensajeAsignacion.tipo === "error" ? "mensaje-fallo" : "mensaje-exito"
                      } mt-3`}
                    >
                      {mensajeAsignacion.texto}
                    </p>
                  )}

                  {!errorAlumnos && !cargandoAlumnos && alumnosDisponibles.length === 0 && (
                    <p className="mt-3 text-xs font-medium text-slate-400 dark:text-neutro-500">
                      Todos los alumnos disponibles ya están asignados a este grupo.
                    </p>
                  )}
                </div>
              </motion.div>
            )}
          </div>
        </motion.section>
      </div>
    </ContenedorAnimado>
  );
};

export default Grupos;
