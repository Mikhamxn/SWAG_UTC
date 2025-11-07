import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area
} from "recharts";
import { obtenerAlumnos } from "../../services/alumnosService";
import { obtenerProfesores } from "../../services/profesoresService";
import { obtenerMaterias } from "../../services/materiasService";
import { obtenerGrupos } from "../../services/gruposService";
import { obtenerAsignaciones } from "../../services/asignacionesService";
import { obtenerGrupoAlumnos } from "../../services/grupoAlumnosService";
import mockData from "../../mocks/dashboardData";

const ContenedorAnimado = motion.section;
const ArticuloAnimado = motion.article;
const TarjetaAnimada = motion.div;

const TarjetaResumen = ({ titulo, valor, descripcion, esResaltado = false }) => (
  <TarjetaAnimada
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.35, ease: "easeOut" }}
    className={`flex flex-col gap-2 rounded-2xl border bg-white/90 p-5 shadow-md shadow-slate-200/60 dark:bg-oscuro-200/70 dark:shadow-black/20 ${
      esResaltado
        ? "border-primario-100/70 dark:border-esmeralda-500/40"
        : "border-slate-100 dark:border-oscuro-300/70"
    }`}
  >
    <span className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400 dark:text-neutro-500">
      {titulo}
    </span>
    <p className="text-3xl font-semibold text-slate-900 dark:text-neutro-50">{valor}</p>
    <p className="text-sm text-slate-500 dark:text-neutro-300">{descripcion}</p>
  </TarjetaAnimada>
);

const contenedorGrafica =
  "rounded-2xl border border-slate-100 bg-white/90 p-6 shadow-md shadow-slate-200/60 dark:border-oscuro-300/70 dark:bg-oscuro-200/70 dark:shadow-black/20";

const colores = [
  "#2563eb",
  "#22c55e",
  "#f97316",
  "#a855f7",
  "#ec4899",
  "#14b8a6",
  "#facc15"
];

const formatearNumero = (valor) => new Intl.NumberFormat("es-MX").format(valor ?? 0);

const Dashboard = () => {
  // Cambia a `false` para volver a consultar la API en lugar de usar datos ficticios
  const USE_MOCK = true;
  const {
    data: alumnos = { datos: [] },
    isLoading: cargandoAlumnos,
    isError: errorAlumnos
  } = useQuery({
    queryKey: ["alumnos"],
    queryFn: obtenerAlumnos,
    staleTime: 1000 * 60,
    // cuando USE_MOCK=true, desactivamos la query y usamos initialData
    initialData: { datos: mockData.alumnos },
    enabled: !USE_MOCK
  });

  const {
    data: profesores = { datos: [] },
    isLoading: cargandoProfesores,
    isError: errorProfesores
  } = useQuery({
    queryKey: ["profesores"],
    queryFn: obtenerProfesores,
    staleTime: 1000 * 60,
    initialData: { datos: mockData.profesores },
    enabled: !USE_MOCK
  });

  const {
    data: materias = { datos: [] },
    isLoading: cargandoMaterias,
    isError: errorMaterias
  } = useQuery({
    queryKey: ["materias"],
    queryFn: obtenerMaterias,
    staleTime: 1000 * 60,
    initialData: { datos: mockData.materias },
    enabled: !USE_MOCK
  });

  const {
    data: grupos = { datos: [] },
    isLoading: cargandoGrupos,
    isError: errorGrupos
  } = useQuery({
    queryKey: ["grupos"],
    queryFn: obtenerGrupos,
    staleTime: 1000 * 60,
    initialData: { datos: mockData.grupos },
    enabled: !USE_MOCK
  });

  const {
    data: asignaciones = { datos: [] },
    isLoading: cargandoAsignaciones,
    isError: errorAsignaciones
  } = useQuery({
    queryKey: ["asignaciones"],
    queryFn: obtenerAsignaciones,
    staleTime: 1000 * 60,
    initialData: { datos: mockData.asignaciones },
    enabled: !USE_MOCK
  });

  const {
    data: grupoAlumnos = { datos: [] },
    isLoading: cargandoGrupoAlumnos,
    isError: errorGrupoAlumnos
  } = useQuery({
    queryKey: ["grupo-alumnos", "dashboard"],
    queryFn: () => obtenerGrupoAlumnos(),
    staleTime: 1000 * 30,
    initialData: { datos: mockData.grupoAlumnos },
    enabled: !USE_MOCK
  });

  const estaCargando =
    cargandoAlumnos ||
    cargandoProfesores ||
    cargandoMaterias ||
    cargandoGrupos ||
    cargandoAsignaciones ||
    cargandoGrupoAlumnos;

  const hayError =
    errorAlumnos || errorProfesores || errorMaterias || errorGrupos || errorAsignaciones || errorGrupoAlumnos;

  const resumen = useMemo(
    () => [
      {
        titulo: "Alumnos",
        valor: formatearNumero(alumnos.datos.length),
        descripcion: "Registros activos de estudiantes." 
      },
      {
        titulo: "Profesores",
        valor: formatearNumero(profesores.datos.length),
        descripcion: "Docentes con acceso al sistema."
      },
      {
        titulo: "Materias",
        valor: formatearNumero(materias.datos.length),
        descripcion: "Catálogo académico disponible."
      },
      {
        titulo: "Grupos",
        valor: formatearNumero(grupos.datos.length),
        descripcion: "Grupos listos para asignaciones.",
        esResaltado: true
      }
    ],
    [alumnos, profesores, materias, grupos]
  );

    // Datos de aulas (desde mocks si USE_MOCK)
    const aulas = useMemo(() => ({ datos: mockData.aulas || [] }), []);

    // Día y hora actuales para determinar ocupación (snapshot)
    const diaSemanaMap = [
      "Domingo",
      "Lunes",
      "Martes",
      "Miércoles",
      "Jueves",
      "Viernes",
      "Sábado"
    ];
    const ahora = new Date();
    const diaHoy = diaSemanaMap[ahora.getDay()];
    const horaActual = ahora.getHours();

    const { aulasOcupadas, aulasLibres, maestrosEnAula, totalMaestrosAhora } = useMemo(() => {
      const ocupadas = new Set();
      const maestrosMap = new Map();

      asignaciones.datos.forEach((a) => {
        // algunas asignaciones tienen Hora en formato '8:00' etc.
        const horaAsign = Number(String(a.Hora || "").split(":")[0]);
        if (a.DiaSemana === diaHoy && horaAsign === horaActual) {
          if (a.AulaID) ocupadas.add(a.AulaID);
          const lista = maestrosMap.get(a.AulaID) ?? [];
          const prof = profesores.datos.find((p) => p.id === a.ProfesorID) || { id: a.ProfesorID, Nombre: `Profesor ${a.ProfesorID}` };
          const grupo = grupos.datos.find((g) => g.id === a.GrupoID) || { Nombre: `Grupo ${a.GrupoID}` };
          lista.push({ profesor: prof, grupo: grupo, hora: a.Hora });
          maestrosMap.set(a.AulaID, lista);
        }
      });

      const totalAhora = new Set();
      maestrosMap.forEach((lista) => lista.forEach((l) => totalAhora.add(l.profesor.id)));

      return {
        aulasOcupadas: ocupadas.size,
        aulasLibres: (aulas.datos?.length || 0) - ocupadas.size,
        maestrosEnAula: Array.from(maestrosMap.entries()).map(([aulaID, lista]) => {
          const aula = aulas.datos.find((x) => x.id === aulaID) || { id: aulaID, Nombre: `Aula ${aulaID}` };
          return { aula, lista };
        }),
        totalMaestrosAhora: totalAhora.size
      };
    }, [asignaciones, profesores, grupos, aulas, diaHoy, horaActual]);

  const alumnosPorGrupo = useMemo(() => {
    const acumulado = new Map();
    grupoAlumnos.datos.forEach((registro) => {
      const etiqueta = registro.Grupo?.Clave || registro.Grupo?.Nombre || `Grupo ${registro.GrupoID}`;
      acumulado.set(etiqueta, (acumulado.get(etiqueta) ?? 0) + 1);
    });

    return Array.from(acumulado.entries())
      .map(([nombre, total]) => ({ nombre, total }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 8);
  }, [grupoAlumnos]);

  const materiasActivas = useMemo(() => {
    const total = materias.datos.reduce(
      (conteo, materia) => {
        if (materia.Activo) {
          conteo.activas += 1;
        } else {
          conteo.inactivas += 1;
        }
        return conteo;
      },
      { activas: 0, inactivas: 0 }
    );

    return [
      { nombre: "Activas", valor: total.activas },
      { nombre: "Inactivas", valor: total.inactivas }
    ];
  }, [materias]);

  const gruposPorTurno = useMemo(() => {
    const agregados = grupos.datos.reduce((conteo, grupo) => {
      const llave = grupo.Turno || "Sin turno";
      conteo[llave] = (conteo[llave] ?? 0) + 1;
      return conteo;
    }, {});

    return Object.entries(agregados).map(([turno, total]) => ({ turno, total }));
  }, [grupos]);

  const asignacionesPorDia = useMemo(() => {
    const dias = asignaciones.datos.reduce((conteo, item) => {
      const dia = item.DiaSemana || "Sin día";
      conteo[dia] = (conteo[dia] ?? 0) + 1;
      return conteo;
    }, {});

    return Object.entries(dias)
      .map(([dia, total]) => ({ dia, total }))
      .sort((a, b) => a.dia.localeCompare(b.dia, "es"));
  }, [asignaciones]);

  return (
    <ContenedorAnimado
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="space-y-8"
    >
      <header className="space-y-2">
        <h2 className="titulo-seccion">Resumen general</h2>
        <p className="descripcion-suave">
          Monitorea el estado académico en tiempo real. Las gráficas se actualizan conforme a los catálogos y
          horarios registrados.
        </p>
      </header>

      {estaCargando && (
        <p className="text-sm font-medium text-slate-500 dark:text-neutro-300">
          Cargando información del panel, un momento por favor...
        </p>
      )}

      {hayError && (
        <p className="mensaje-estado mensaje-fallo">
          No fue posible obtener toda la información necesaria. Verifica la API y vuelve a intentar.
        </p>
      )}

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {resumen.map((tarjeta) => (
          <TarjetaResumen key={tarjeta.titulo} {...tarjeta} />
        ))}
      </section>

      {/* Nueva sección: Aulas y presencia */}
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <TarjetaResumen titulo="Aulas ocupadas" valor={formatearNumero(aulasOcupadas)} descripcion={`Aulas ocupadas en ${diaHoy} a las ${horaActual}:00`} />
        <TarjetaResumen titulo="Aulas libres" valor={formatearNumero(aulasLibres)} descripcion="Aulas sin asignación en este bloque horario." />
        <TarjetaResumen titulo="Alumnos en edificio" valor={formatearNumero(alumnos.datos.length)} descripcion="Estimado de alumnos presentes (basado en grupos)." />
        <TarjetaResumen titulo="Profesores registrados" valor={formatearNumero(profesores.datos.length)} descripcion={`Profesores totales (en aula ahora: ${formatearNumero(totalMaestrosAhora)})`} />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <ArticuloAnimado
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut", delay: 0.05 }}
          className={contenedorGrafica}
        >
          <div className="flex flex-col gap-1">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-neutro-50">
              Alumnos por grupo (top 8)
            </h3>
            <p className="text-sm text-slate-500 dark:text-neutro-300">
              Distribución de estudiantes registrados por grupo académico.
            </p>
          </div>
          <div className="mt-6 h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={alumnosPorGrupo}>
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                <XAxis dataKey="nombre" tick={{ fontSize: 12 }} interval={0} angle={-10} textAnchor="end" />
                <YAxis allowDecimals={false} />
                <Tooltip formatter={(valor) => [`${valor} alumno${valor === 1 ? "" : "s"}`, "Total"]} />
                <Bar dataKey="total" radius={[8, 8, 0, 0]} fill="#2563eb" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ArticuloAnimado>

        <ArticuloAnimado
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut", delay: 0.08 }}
          className={contenedorGrafica}
        >
          <div className="flex flex-col gap-1">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-neutro-50">
              Estado de materias
            </h3>
            <p className="text-sm text-slate-500 dark:text-neutro-300">
              Visualiza cuántas materias se encuentran activas frente a las deshabilitadas.
            </p>
          </div>
          <div className="mt-6 h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={materiasActivas}
                  dataKey="valor"
                  nameKey="nombre"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={4}
                  startAngle={90}
                  endAngle={450}
                >
                  {materiasActivas.map((entrada, indice) => (
                    <Cell key={entrada.nombre} fill={colores[indice % colores.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(valor, nombre) => [`${valor} materias`, nombre]} />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </ArticuloAnimado>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <ArticuloAnimado
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut", delay: 0.05 }}
          className={contenedorGrafica}
        >
          <div className="flex flex-col gap-1">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-neutro-50">
              Grupos por turno
            </h3>
            <p className="text-sm text-slate-500 dark:text-neutro-300">
              Identifica la carga de grupos en cada turno operativo.
            </p>
          </div>
          <div className="mt-6 h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={gruposPorTurno} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                <XAxis type="number" allowDecimals={false} />
                <YAxis type="category" dataKey="turno" width={100} />
                <Tooltip formatter={(valor) => [`${valor} grupos`, "Total"]} />
                <Bar dataKey="total" radius={[0, 8, 8, 0]} fill="#22c55e" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ArticuloAnimado>

        <ArticuloAnimado
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut", delay: 0.08 }}
          className={contenedorGrafica}
        >
          <div className="flex flex-col gap-1">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-neutro-50">
              Horarios por día
            </h3>
            <p className="text-sm text-slate-500 dark:text-neutro-300">
              Cantidad de asignaciones activas distribuidas por día de la semana.
            </p>
          </div>
          <div className="mt-6 h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={asignacionesPorDia}>
                <defs>
                  <linearGradient id="colorHorario" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                <XAxis dataKey="dia" />
                <YAxis allowDecimals={false} />
                <Tooltip formatter={(valor) => [`${valor} horarios`, "Total"]} />
                <Area type="monotone" dataKey="total" stroke="#f97316" fill="url(#colorHorario)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ArticuloAnimado>
      </section>

      <section className="grid gap-6">
        <ArticuloAnimado
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut", delay: 0.05 }}
          className={contenedorGrafica}
        >
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-neutro-50">Profesores - ubicación según horario</h3>
              <p className="text-sm text-slate-500 dark:text-neutro-300">Listado de profesores que deberían estar en aula en este bloque horario ({diaHoy} {horaActual}:00).</p>
            </div>
          </div>

          <div className="mt-4 space-y-3">
            {maestrosEnAula.length === 0 && (
              <p className="text-sm text-slate-500">No hay profesores asignados en este bloque horario.</p>
            )}

            {maestrosEnAula.map(({ aula, lista }) => (
              <div key={aula.id} className="rounded-lg border p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold">{aula.Nombre} <span className="text-xs text-slate-400">· {aula.Edificio}</span></p>
                  </div>
                </div>
                <ul className="mt-2 ml-3 list-disc text-sm text-slate-600">
                  {lista.map((item, idx) => (
                    <li key={idx}>
                      <strong>{item.profesor.Nombre}</strong> — {item.grupo.Nombre} <span className="text-xs text-slate-400">({item.hora})</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </ArticuloAnimado>
      </section>

      <footer className="rounded-2xl border border-slate-100 bg-white/90 p-4 text-xs text-slate-500 shadow-sm dark:border-oscuro-300/60 dark:bg-oscuro-200/70 dark:text-neutro-400">
        * Los indicadores dependen de la información registrada en tiempo real. Considera ejecutar nuevamente las
        consultas si agregas o modificas catálogos.
      </footer>
    </ContenedorAnimado>
  );
};

export default Dashboard;
