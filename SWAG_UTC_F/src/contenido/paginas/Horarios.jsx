import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const DIAS = [
  { id: "lunes", etiqueta: "Lunes" },
  { id: "martes", etiqueta: "Martes" },
  { id: "miercoles", etiqueta: "Miércoles" },
  { id: "jueves", etiqueta: "Jueves" },
  { id: "viernes", etiqueta: "Viernes" },
];

const BLOQUES = [
  { id: "17:00", etiqueta: "5:00 p.m." },
  { id: "17:45", etiqueta: "5:45 p.m." },
  { id: "18:30", etiqueta: "6:30 p.m." },
  { id: "19:15", etiqueta: "7:15 p.m." },
  { id: "20:00", etiqueta: "8:00 p.m." },
  { id: "20:45", etiqueta: "8:45 p.m." },
  { id: "21:30", etiqueta: "9:30 p.m." },
];

const MATERIAS_INICIALES = [
  {
    id: "MAT101",
    nombre: "Álgebra Lineal",
    clave: "MAT101",
    profesor: "Mtra. Ortega",
    gradiente: "from-emerald-500/90 via-emerald-500/95 to-emerald-600/90",
    sombra: "shadow-emerald-500/30",
  },
  {
    id: "PHY210",
    nombre: "Física General",
    clave: "PHY210",
    profesor: "Dr. Martínez",
    gradiente: "from-sky-500/90 via-sky-500/95 to-blue-600/90",
    sombra: "shadow-sky-500/30",
  },
  {
    id: "CS320",
    nombre: "Programación Avanzada",
    clave: "CS320",
    profesor: "Ing. Velázquez",
    gradiente: "from-indigo-500/90 via-indigo-500/95 to-purple-600/90",
    sombra: "shadow-indigo-500/30",
  },
  {
    id: "IA400",
    nombre: "Inteligencia Artificial",
    clave: "IA400",
    profesor: "Dra. Salinas",
    gradiente: "from-violet-500/90 via-violet-500/95 to-fuchsia-600/90",
    sombra: "shadow-violet-500/30",
  },
  {
    id: "BD250",
    nombre: "Base de Datos II",
    clave: "BD250",
    profesor: "Mtro. Álvarez",
    gradiente: "from-amber-500/90 via-amber-500/95 to-orange-600/90",
    sombra: "shadow-amber-500/30",
  },
  {
    id: "ETH150",
    nombre: "Ética Profesional",
    clave: "ETH150",
    profesor: "Lic. Chávez",
    gradiente: "from-rose-500/90 via-rose-500/95 to-red-600/90",
    sombra: "shadow-rose-500/30",
  },
  {
    id: "BIO110",
    nombre: "Biología Celular",
    clave: "BIO110",
    profesor: "Dra. Romero",
    gradiente: "from-teal-500/90 via-teal-500/95 to-emerald-600/90",
    sombra: "shadow-emerald-500/25",
  },
  {
    id: "LGF220",
    nombre: "Lenguajes Formales",
    clave: "LGF220",
    profesor: "Ing. Muñoz",
    gradiente: "from-cyan-500/90 via-cyan-500/95 to-sky-600/90",
    sombra: "shadow-cyan-500/25",
  },
];

const crearMapaInicial = () => {
  const base = {};
  DIAS.forEach((dia) => {
    base[dia.id] = {};
    BLOQUES.forEach((bloque) => {
      base[dia.id][bloque.id] = null;
    });
  });
  return base;
};

const obtenerEtiquetaDia = (diaId) => DIAS.find((dia) => dia.id === diaId)?.etiqueta ?? "";
const obtenerEtiquetaBloque = (bloqueId) =>
  BLOQUES.find((bloque) => bloque.id === bloqueId)?.etiqueta ?? "";

const SeccionAnimada = motion.section;
const EncabezadoAnimado = motion.header;
const AvisoAnimado = motion.div;
const PanelCatalogo = motion.section;
const ListaAnimada = motion.div;
const TarjetaMateria = motion.div;
const PanelHorario = motion.section;
const EncabezadoDia = motion.div;
const FilaHorario = motion.div;
const TarjetaAsignada = motion.div;
const IndicadorAnimado = motion.div;
const CajaDisponible = motion.div;

const Horarios = () => {
  const [busqueda, setBusqueda] = useState("");
  const [mensaje, setMensaje] = useState(null);
  const [celdaActiva, setCeldaActiva] = useState(null);
  const [arrastrando, setArrastrando] = useState(null);
  const [asignaciones, setAsignaciones] = useState(crearMapaInicial);

  const materiasFiltradas = useMemo(() => {
    if (!busqueda.trim()) {
      return MATERIAS_INICIALES;
    }

    const termino = busqueda.trim().toLowerCase();
    return MATERIAS_INICIALES.filter((materia) =>
      [materia.nombre, materia.clave, materia.profesor]
        .filter(Boolean)
        .some((valor) => valor.toLowerCase().includes(termino))
    );
  }, [busqueda]);

  useEffect(() => {
    if (!mensaje) {
      return;
    }
    const temporizador = setTimeout(() => setMensaje(null), 2400);
    return () => clearTimeout(temporizador);
  }, [mensaje]);

  const manejarDrop = (diaId, bloqueId) => (evento) => {
    evento.preventDefault();
    const materiaId = evento.dataTransfer.getData("text/plain");
    if (!materiaId) {
      return;
    }

    const materiaSeleccionada = MATERIAS_INICIALES.find((materia) => materia.id === materiaId);
    if (!materiaSeleccionada) {
      return;
    }

    const bloqueActual = asignaciones[diaId][bloqueId];
    if (bloqueActual) {
      setMensaje({
        tipo: "error",
        texto: "Ese bloque ya está ocupado. Elimina la materia anterior para reagendar.",
      });
      return;
    }

    const materiasMismoDia = asignaciones[diaId];
    const materiaYaProgramada = Object.values(materiasMismoDia).some(
      (entrada) => entrada?.id === materiaSeleccionada.id
    );

    if (materiaYaProgramada) {
      setMensaje({
        tipo: "error",
        texto: `${materiaSeleccionada.nombre} ya está programada el ${obtenerEtiquetaDia(diaId)}.`,
      });
      return;
    }

    setAsignaciones((previo) => ({
      ...previo,
      [diaId]: {
        ...previo[diaId],
        [bloqueId]: materiaSeleccionada,
      },
    }));

    setMensaje({
      tipo: "exito",
      texto: `${materiaSeleccionada.nombre} asignada el ${obtenerEtiquetaDia(diaId)} a las ${obtenerEtiquetaBloque(
        bloqueId
      )}`,
    });
    setArrastrando(null);
    setCeldaActiva(null);
  };

  const manejarEliminar = (diaId, bloqueId) => {
    const materia = asignaciones[diaId][bloqueId];
    if (!materia) {
      return;
    }

    setAsignaciones((previo) => ({
      ...previo,
      [diaId]: {
        ...previo[diaId],
        [bloqueId]: null,
      },
    }));

    setMensaje({
      tipo: "exito",
      texto: `${materia.nombre} se eliminó del bloque ${obtenerEtiquetaBloque(bloqueId)}.`,
    });
  };

  const clasesCelda = (diaId, bloqueId, tieneMateria) => {
    const esActiva = celdaActiva?.dia === diaId && celdaActiva?.bloque === bloqueId;
    return [
      "relative min-h-[120px] rounded-2xl border border-dashed border-slate-200/70 bg-white/85 p-4 transition-all duration-200 ease-out dark:border-oscuro-300/70 dark:bg-oscuro-200/60",
      esActiva
        ? "border-primario-400/80 bg-primario-50/40 shadow-lg shadow-primario-500/15 dark:border-esmeralda-500/60 dark:bg-oscuro-200/70"
        : "",
      tieneMateria
        ? "border-solid border-transparent bg-transparent shadow-lg shadow-slate-200/60 dark:shadow-black/30"
        : "",
      !tieneMateria && !esActiva
        ? "hover:border-primario-300 hover:bg-primario-50/25 dark:hover:border-esmeralda-500/40 dark:hover:bg-oscuro-200/70"
        : "",
    ]
      .filter(Boolean)
      .join(" ");
  };

  const mensajeEstaActivo = Boolean(mensaje);

  return (
    <SeccionAnimada
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="space-y-10"
    >
      <EncabezadoAnimado
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="flex flex-col gap-4"
      >
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-2">
            <h2 className="titulo-seccion">Planificador de horarios</h2>
            <p className="descripcion-suave max-w-3xl">
              Organiza las materias vespertinas arrastrándolas al bloque disponible. Arrastra una materia a un bloque de 45 minutos. No se permiten choques.
            </p>
          </div>
          <AvisoAnimado
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4, ease: "easeOut" }}
            className="rounded-2xl border border-slate-200/70 bg-white/90 px-4 py-3 text-sm font-medium text-slate-500 shadow-sm dark:border-oscuro-200 dark:bg-oscuro-200/60 dark:text-neutro-300"
          >
            Horario vespertino · 5 columnas · Bloques de 45 minutos.
          </AvisoAnimado>
        </div>

        <AnimatePresence>
          {mensajeEstaActivo && (
            <AvisoAnimado
              key={mensaje?.texto}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-semibold shadow-sm ${
                mensaje?.tipo === "error"
                  ? "border-rose-500/40 bg-rose-500/10 text-rose-400 dark:border-rose-500/50 dark:text-rose-300"
                  : "border-esmeralda-500/40 bg-esmeralda-500/10 text-esmeralda-500 dark:border-esmeralda-500/50"
              }`}
            >
              {mensaje?.tipo === "error" ? "⚠️" : "✅"}
              <span>{mensaje?.texto}</span>
            </AvisoAnimado>
          )}
        </AnimatePresence>
      </EncabezadoAnimado>

      <div className="space-y-10">
        <PanelCatalogo
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="tarjeta-suave space-y-6 p-6"
        >
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-neutro-50">Catálogo de materias</h3>
              <p className="text-sm text-slate-500 dark:text-neutro-300">
                Arrastra una materia directamente hacia el bloque disponible en el horario.
              </p>
            </div>

            <div className="relative w-full max-w-sm">
              <input
                type="search"
                value={busqueda}
                onChange={(evento) => setBusqueda(evento.target.value)}
                placeholder="Buscar por nombre, clave o docente..."
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 pr-10 text-sm font-medium text-slate-600 shadow-sm transition focus:border-primario-500 focus:outline-none focus:ring-2 focus:ring-primario-500/30 dark:border-oscuro-300 dark:bg-oscuro-200/70 dark:text-neutro-200 dark:focus:border-esmeralda-500 dark:focus:ring-esmeralda-500/30"
              />
              <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-400 dark:text-neutro-500">
                🔍
              </span>
            </div>
          </div>

          <ListaAnimada
            layout
            className="grid grid-cols-1 gap-2.5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6"
          >
            <AnimatePresence initial={false}>
              {materiasFiltradas.map((materia, indice) => (
                <TarjetaMateria
                  key={materia.id}
                  layout
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.35, ease: "easeOut", delay: indice * 0.04 }}
                  draggable
                  onDragStart={(evento) => {
                    evento.dataTransfer.setData("text/plain", materia.id);
                    evento.dataTransfer.effectAllowed = "move";
                    setArrastrando(materia.id);
                  }}
                  onDragEnd={() => {
                    setArrastrando(null);
                    setCeldaActiva(null);
                  }}
                  className={`group min-h-[108px] cursor-grab rounded-xl border border-slate-200 bg-white/95 p-2 shadow-sm transition hover:-translate-y-[2px] hover:shadow-lg active:cursor-grabbing dark:border-oscuro-200 dark:bg-oscuro-200/80 ${materia.sombra}`}
                >
                  <div
                    className={`rounded-lg bg-gradient-to-r ${materia.gradiente} p-2 text-white shadow-inner`}
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-[9px] font-semibold uppercase tracking-[0.24em] text-white/70">
                        {materia.clave}
                      </p>
                      <span className="rounded-full bg-white/25 px-1.5 py-[1px] text-[8px] font-semibold uppercase">
                        45 min
                      </span>
                    </div>
                    <h4 className="mt-1 text-sm font-semibold leading-snug">
                      {materia.nombre}
                    </h4>
                    <p className="mt-1 text-[10px] font-medium text-white/80">
                      {materia.profesor}
                    </p>
                  </div>
                </TarjetaMateria>
              ))}
            </AnimatePresence>

            {materiasFiltradas.length === 0 && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full text-sm font-medium text-slate-400 dark:text-neutro-500"
              >
                No hay materias que coincidan con la búsqueda.
              </motion.p>
            )}
          </ListaAnimada>
        </PanelCatalogo>

        <PanelHorario
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="tarjeta-suave overflow-hidden"
        >
          <div className="border-b border-slate-100 bg-white/90 px-6 py-5 dark:border-oscuro-200/60 dark:bg-oscuro-200/70">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-neutro-50">
              Horario de la semana
            </h3>
            <p className="text-sm text-slate-500 dark:text-neutro-300">
              Sin desplazamiento horizontal · Organiza cada bloque de 45 minutos con validación de choques.
            </p>
          </div>

          <div className="space-y-6 px-4 py-6 sm:px-6">
            <div className="hidden xl:grid xl:grid-cols-[140px_repeat(5,minmax(0,1fr))] xl:gap-4">
              <div className="text-sm font-semibold uppercase tracking-[0.35em] text-slate-400 dark:text-neutro-500">
                Hora
              </div>
              {DIAS.map((dia) => (
                <EncabezadoDia
                  key={dia.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  className="rounded-xl border border-slate-200/70 bg-white/80 px-4 py-3 text-center text-sm font-semibold uppercase tracking-wide text-slate-500 shadow-sm dark:border-oscuro-200 dark:bg-oscuro-200/70 dark:text-neutro-300"
                >
                  {dia.etiqueta}
                </EncabezadoDia>
              ))}
            </div>

            <div className="space-y-6">
              {BLOQUES.map((bloque) => (
                <FilaHorario
                  key={bloque.id}
                  layout
                  className="grid gap-4 xl:grid-cols-[140px_repeat(5,minmax(0,1fr))]"
                >
                  <div className="rounded-xl border border-slate-200/70 bg-white/80 px-4 py-3 text-sm font-semibold text-slate-500 shadow-sm dark:border-oscuro-200 dark:bg-oscuro-200/70 dark:text-neutro-300">
                    {bloque.etiqueta}
                  </div>
                  {DIAS.map((dia) => {
                    const asignacion = asignaciones[dia.id][bloque.id];
                    const tieneMateria = Boolean(asignacion);
                    const esArrastrable = arrastrando && !tieneMateria;

                    return (
                      <div
                        key={`${dia.id}-${bloque.id}`}
                        onDragOver={(evento) => evento.preventDefault()}
                        onDragEnter={(evento) => {
                          evento.preventDefault();
                          setCeldaActiva({ dia: dia.id, bloque: bloque.id });
                        }}
                        onDragLeave={(evento) => {
                          evento.preventDefault();
                          setCeldaActiva((previo) => {
                            if (previo?.dia === dia.id && previo?.bloque === bloque.id) {
                              return null;
                            }
                            return previo;
                          });
                        }}
                        onDrop={manejarDrop(dia.id, bloque.id)}
                        className={clasesCelda(dia.id, bloque.id, tieneMateria)}
                      >
                        <span className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-neutro-400 xl:hidden">
                          {obtenerEtiquetaDia(dia.id)}
                        </span>

                        <AnimatePresence mode="wait" initial={false}>
                          {tieneMateria ? (
                            <TarjetaAsignada
                              key={asignacion.id}
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.95 }}
                              transition={{ duration: 0.25, ease: "easeOut" }}
                              className={`flex h-full flex-col justify-between gap-3 rounded-xl border border-white/35 bg-gradient-to-r p-4 text-white shadow-lg ${
                                asignacion.gradiente
                              }`}
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/70">
                                    {asignacion.clave}
                                  </p>
                                  <h4 className="mt-1 text-lg font-semibold leading-snug">
                                    {asignacion.nombre}
                                  </h4>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => manejarEliminar(dia.id, bloque.id)}
                                  className="rounded-full bg-white/15 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-white/80 transition hover:bg-white/25"
                                >
                                  Quitar
                                </button>
                              </div>
                              <p className="text-sm font-medium text-white/80">
                                {asignacion.profesor}
                              </p>
                            </TarjetaAsignada>
                          ) : esArrastrable ? (
                            <IndicadorAnimado
                              key="indicador"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="flex h-full items-center justify-center rounded-xl border-2 border-dashed border-primario-300/80 bg-primario-50/30 text-xs font-semibold uppercase tracking-wide text-primario-600 dark:border-esmeralda-500/60 dark:bg-oscuro-200/50 dark:text-esmeralda-500"
                            >
                              Suelta aquí
                            </IndicadorAnimado>
                          ) : (
                            <CajaDisponible
                              key="disponible"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 0.85 }}
                              exit={{ opacity: 0 }}
                              className="flex h-full items-center justify-center rounded-xl border border-dashed border-slate-200/70 bg-white/60 px-3 py-4 text-xs font-semibold uppercase tracking-wide text-slate-400 shadow-inner dark:border-oscuro-300/60 dark:bg-oscuro-300/40 dark:text-neutro-400"
                            >
                              Disponible
                            </CajaDisponible>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </FilaHorario>
              ))}
            </div>
          </div>
        </PanelHorario>
      </div>
    </SeccionAnimada>
  );
};

export default Horarios;
