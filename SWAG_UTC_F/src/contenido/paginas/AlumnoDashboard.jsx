import React, { useMemo } from "react";
import { motion } from "framer-motion";

const ContenedorAnimado = motion.section;
const TarjetaAnimada = motion.article;

const LIMITE_EXTRAORDINARIO = 0.2;
const LOGO_UTC = "https://cdn.brandfetch.io/idK4M4OQPU/w/1153/h/1152/theme/dark/icon.jpeg?c=1bxid64Mup7aczewSAYMX&t=1746846832780";

const alumnoMock = {
  nombre: "María Fernanda Gutiérrez",
  matricula: "A20254",
  cuatrimestre: "3.er cuatrimestre · Ingeniería en Software",
  periodo: "Septiembre - Diciembre 2025",
  materias: [
    {
      id: 1,
      nombre: "Matemáticas Aplicadas",
      totalSesiones: 32,
      faltasSesiones: 3,
      ultimaFalta: "2025-10-25",
      docente: "Mtro. Raúl Sánchez"
    },
    {
      id: 2,
      nombre: "Programación Orientada a Objetos",
      totalSesiones: 34,
      faltasSesiones: 5,
      ultimaFalta: "2025-10-28",
      docente: "Mtra. Ivonne Díaz"
    },
    {
      id: 3,
      nombre: "Bases de Datos II",
      totalSesiones: 30,
      faltasSesiones: 2,
      ultimaFalta: "2025-09-30",
      docente: "Mtro. Óscar Morales"
    },
    {
      id: 4,
      nombre: "Arquitectura de Software",
      totalSesiones: 28,
      faltasSesiones: 1,
      ultimaFalta: "2025-10-08",
      docente: "Mtra. Gabriela Juárez"
    },
    {
      id: 5,
      nombre: "Inglés Técnico",
      totalSesiones: 26,
      faltasSesiones: 0,
      ultimaFalta: null,
      docente: "Lic. Jorge Velasco"
    }
  ],
  incidenciasRecientes: [
    {
      fecha: "2025-10-28",
      materia: "Programación Orientada a Objetos",
      hora: "09:00",
      motivo: "Tránsito"
    },
    {
      fecha: "2025-10-25",
      materia: "Matemáticas Aplicadas",
      hora: "08:00",
      motivo: "Enfermedad"
    },
    {
      fecha: "2025-10-18",
      materia: "Programación Orientada a Objetos",
      hora: "11:00",
      motivo: "Consulta médica"
    }
  ]
};

const calcularTotales = (materias) => {
  const totalSesionesPlaneadas = materias.reduce((acum, materia) => acum + materia.totalSesiones, 0);
  const totalFaltas = materias.reduce((acum, materia) => acum + materia.faltasSesiones, 0);
  const porcentajeFaltas = totalSesionesPlaneadas > 0 ? (totalFaltas / totalSesionesPlaneadas) * 100 : 0;
  const materiasEnRiesgo = materias.filter((materia) => materia.faltasSesiones / materia.totalSesiones >= LIMITE_EXTRAORDINARIO).length;

  return {
    totalSesionesPlaneadas,
    totalFaltas,
    porcentajeFaltas,
    materiasEnRiesgo,
    totalSesionesCumplidas: totalSesionesPlaneadas - totalFaltas
  };
};

const DashboardAlumno = () => {
  const totales = useMemo(() => calcularTotales(alumnoMock.materias), []);

  const materiasConDetalle = useMemo(
    () =>
      alumnoMock.materias.map((materia) => {
        const porcentaje = materia.totalSesiones > 0 ? (materia.faltasSesiones / materia.totalSesiones) * 100 : 0;
        return {
          ...materia,
          porcentajeFaltas: porcentaje,
          excedeLimite: porcentaje >= LIMITE_EXTRAORDINARIO * 100
        };
      }),
    []
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 py-10 text-white">
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-10 px-6 lg:px-10">
        <ContenedorAnimado
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="rounded-4xl relative overflow-hidden border border-slate-700/60 bg-[#1a2235]/90 p-10 shadow-2xl shadow-black/30"
        >
          <div className="pointer-events-none absolute -top-32 -right-24 h-64 w-64 rounded-full bg-primario-500/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-16 h-56 w-56 rounded-full bg-emerald-400/10 blur-3xl" />

          <motion.header initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease: "easeOut", delay: 0.05 }}>
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3 text-emerald-400">
                  <img src={LOGO_UTC} alt="Universidad Tecnológica de Coahuila" className="h-12 w-auto rounded-lg bg-white/5 p-1" />
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.35em]">Universidad Tecnológica de Coahuila</p>
                    <span className="text-[11px] uppercase tracking-[0.4em] text-slate-400">Panel del estudiante</span>
                  </div>
                </div>
                <h1 className="text-4xl font-semibold text-white">{alumnoMock.nombre}</h1>
                <p className="text-sm text-slate-300">Matrícula {alumnoMock.matricula} · {alumnoMock.cuatrimestre}</p>
              </div>
              <div className="rounded-3xl border border-emerald-400/30 bg-emerald-500/10 px-6 py-4 text-sm font-semibold text-emerald-200 shadow-emerald-500/20 backdrop-blur">
                Periodo {alumnoMock.periodo}
              </div>
            </div>
          </motion.header>

          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: "easeOut", delay: 0.12 }}
            className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4"
          >
            <TarjetaAnimada
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-black/30 backdrop-blur"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-300">Total de faltas</p>
              <p className="mt-3 text-4xl font-semibold text-white">{totales.totalFaltas} sesiones</p>
              <p className="text-sm text-slate-300">Sesiones ausentes acumuladas en el cuatrimestre.</p>
            </TarjetaAnimada>

            <TarjetaAnimada
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: "easeOut", delay: 0.05 }}
              className={`rounded-3xl border p-6 shadow-lg shadow-black/30 backdrop-blur ${totales.porcentajeFaltas >= LIMITE_EXTRAORDINARIO * 100 ? "border-rose-400/50 bg-rose-500/10 text-rose-200" : "border-white/10 bg-white/5"}`}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-300">Porcentaje de faltas</p>
              <div className="mt-4 flex items-center gap-5">
                <div
                  className="relative flex h-20 w-20 items-center justify-center rounded-full bg-white/5 shadow-inner shadow-black/40"
                  style={{ background: `conic-gradient(${totales.porcentajeFaltas >= LIMITE_EXTRAORDINARIO * 100 ? "#f87171" : "#34d399"} ${totales.porcentajeFaltas}%, rgba(255,255,255,0.08) 0)` }}
                >
                  <span className="text-lg font-semibold text-white">{totales.porcentajeFaltas.toFixed(1)}%</span>
                </div>
                <p className="text-sm text-slate-300">
                  {totales.porcentajeFaltas >= LIMITE_EXTRAORDINARIO * 100
                    ? "Has superado el límite permitido. Debes ponerte al corriente."
                    : "Mantente por debajo del 20% para evitar extraordinarios."}
                </p>
              </div>
            </TarjetaAnimada>

            <TarjetaAnimada
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: "easeOut", delay: 0.1 }}
              className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-black/30 backdrop-blur"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-300">Sesiones asistidas</p>
              <p className="mt-3 text-4xl font-semibold text-white">{totales.totalSesionesCumplidas}</p>
              <p className="text-sm text-slate-300">Sesiones cumplidas de un total de {totales.totalSesionesPlaneadas} programadas.</p>
            </TarjetaAnimada>

            <TarjetaAnimada
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: "easeOut", delay: 0.15 }}
              className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-black/30 backdrop-blur"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-300">Materias en riesgo</p>
              <p className="mt-3 text-4xl font-semibold text-white">{totales.materiasEnRiesgo}</p>
              <p className="text-sm text-slate-300">Materias con más del 20% de faltas en el cuatrimestre.</p>
            </TarjetaAnimada>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
            className="mt-12"
          >
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-white">Faltas por materia</h2>
                <p className="text-sm text-slate-300">Cada barra muestra el porcentaje de ausencias respecto al total de sesiones planificadas.</p>
              </div>
              <span className="rounded-full border border-white/10 bg-white/10 px-5 py-1.5 text-xs font-semibold uppercase tracking-wide text-emerald-200">
                Límite permitido: 20%
              </span>
            </div>

            <div className="mt-6 grid gap-5 lg:grid-cols-2">
              {materiasConDetalle.map((materia) => (
                <div key={materia.id} className="rounded-3xl border border-white/10 bg-white/[0.08] p-6 shadow-xl shadow-black/30 backdrop-blur">
                  <div className="flex flex-col gap-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-base font-semibold text-white">{materia.nombre}</p>
                        <p className="text-xs text-slate-300">Docente: {materia.docente}</p>
                        <p className="text-xs text-slate-300">Sesiones programadas: {materia.totalSesiones}</p>
                      </div>
                      <div className={`rounded-full px-4 py-1 text-xs font-semibold uppercase tracking-wide ${materia.excedeLimite ? "bg-rose-500/20 text-rose-200" : "bg-emerald-500/15 text-emerald-200"}`}>
                        {materia.excedeLimite ? "Extraordinario" : "Dentro del límite"}
                      </div>
                    </div>
                    <div className="relative">
                      <div className="h-3 rounded-full bg-slate-700/40">
                        <div
                          className={`h-full rounded-full ${materia.excedeLimite ? "bg-gradient-to-r from-rose-500 via-rose-400 to-rose-500" : "bg-gradient-to-r from-emerald-400 via-emerald-300 to-emerald-400"}`}
                          style={{ width: `${Math.min(materia.porcentajeFaltas, 100)}%` }}
                        />
                      </div>
                      <span className="absolute -top-6 right-0 text-sm font-semibold text-white">
                        {materia.faltasSesiones} de {materia.totalSesiones} · {materia.porcentajeFaltas.toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex flex-col gap-1 text-xs text-slate-300">
                      <span>Última falta: {materia.ultimaFalta ? new Date(materia.ultimaFalta).toLocaleDateString("es-MX", { day: "2-digit", month: "short", year: "numeric" }) : "No hay registros"}</span>
                      <span>Restantes antes del límite: {Math.max(Math.ceil(materia.totalSesiones * LIMITE_EXTRAORDINARIO) - materia.faltasSesiones, 0)} sesiones</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.28 }}
            className="mt-14"
          >
            <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
              <h2 className="text-xl font-semibold text-white">Incidencias recientes</h2>
              <p className="text-xs text-slate-300">Últimos reportes durante el cuatrimestre.</p>
            </div>

            <div className="mt-4 space-y-3">
              {alumnoMock.incidenciasRecientes.map((incidencia, index) => (
                <div
                  key={`${incidencia.fecha}-${incidencia.materia}-${index}`}
                  className="flex flex-col gap-2 rounded-2xl border border-white/5 bg-white/10 px-5 py-3 text-sm text-slate-100 shadow-lg shadow-black/30 backdrop-blur md:flex-row md:items-center md:justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-200 shadow-inner">
                      {new Date(incidencia.fecha).toLocaleDateString("es-MX", { day: "2-digit", month: "short" })}
                    </div>
                    <div>
                      <p className="font-semibold text-white">{incidencia.materia}</p>
                      <p className="text-xs text-slate-300">Motivo: {incidencia.motivo || "Sin especificar"}</p>
                    </div>
                  </div>
                  <div className="text-xs font-semibold uppercase tracking-wide text-slate-300">
                    {new Date(incidencia.fecha).toLocaleDateString("es-MX", { weekday: "short", day: "2-digit", month: "short" })} · {incidencia.hora}
                  </div>
                </div>
              ))}
            </div>
          </motion.section>
        </ContenedorAnimado>
      </div>
    </div>
  );
};

export default DashboardAlumno;
