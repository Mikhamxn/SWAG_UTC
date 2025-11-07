import React, { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { obtenerAlumnos } from "../../services/alumnosService";
import { obtenerGrupos } from "../../services/gruposService";
import { obtenerGrupoAlumnos } from "../../services/grupoAlumnosService";
import { obtenerAsignaciones } from "../../services/asignacionesService";
import mockData from "../../mocks/dashboardData";

const ContenedorAnimado = motion.section;
const TarjetaAnimada = motion.article;

const diasSemana = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

const formatearHora = (valor) => {
	if (!valor) return "";
	const texto = String(valor);
	const partes = texto.split(":");
	if (partes.length >= 2) {
		return `${partes[0].padStart(2, "0")}:${partes[1].padStart(2, "0")}`;
	}
	return texto;
};

const construirBloqueHorario = (inicio, fin) => {
	const horaInicio = formatearHora(inicio);
	const horaFin = formatearHora(fin);
	if (horaInicio && horaFin) return `${horaInicio} - ${horaFin}`;
	if (horaInicio) return horaInicio;
	return "General";
};

const normalizarAlumno = (alumno) => {
	if (!alumno) return null;
	const id =
		alumno.AlumnoID ??
		alumno.alumnoId ??
		alumno.id ??
		alumno.ID ??
		null;
	if (id === null) return null;
	const nombre = [alumno.Nombre ?? alumno.nombre, alumno.Apellido ?? alumno.apellido]
		.filter(Boolean)
		.join(" ")
		.trim();
	return {
		id: Number(id),
		nombre: nombre || alumno.Nombre || alumno.nombre || `Alumno ${id}`,
		matricula: alumno.Matricula ?? alumno.matricula ?? "",
		email: alumno.Email ?? alumno.email ?? "",
		activo: alumno.Activo ?? alumno.activo ?? true,
		referencia: alumno
	};
};

const normalizarGrupo = (grupo) => {
	if (!grupo) return null;
	const id = grupo.GrupoID ?? grupo.id ?? grupo.grupoId ?? null;
	if (id === null) return null;
	return {
		id: Number(id),
		nombre: grupo.Nombre ?? grupo.nombre ?? `Grupo ${id}`,
		turno: grupo.Turno ?? grupo.turno ?? "",
		clave: grupo.Clave ?? grupo.clave ?? "",
		referencia: grupo
	};
};

const normalizarMateria = (materia) => {
	if (!materia) return null;
	const id = materia.MateriaID ?? materia.id ?? materia.materiaId ?? null;
	if (id === null) return null;
	return {
		id: Number(id),
		nombre: materia.Nombre ?? materia.nombre ?? `Materia ${id}`
	};
};

const normalizarProfesor = (profesor) => {
	if (!profesor) return null;
	const id = profesor.ProfesorID ?? profesor.id ?? profesor.profesorId ?? null;
	if (id === null) return null;
	const nombre = [profesor.Nombre ?? profesor.nombre, profesor.Apellido ?? profesor.apellido]
		.filter(Boolean)
		.join(" ")
		.trim();
	return {
		id: Number(id),
		nombre: nombre || profesor.Nombre || profesor.nombre || `Profesor ${id}`
	};
};

const normalizarAsignacion = (asignacion, materiasMap, profesoresMap) => {
	if (!asignacion) return null;
	const grupoId = asignacion.GrupoID ?? asignacion?.Grupo?.GrupoID ?? asignacion.grupoId ?? null;
	if (grupoId === null) return null;
	const materia =
		asignacion.Materia ??
		materiasMap.get(asignacion.MateriaID ?? asignacion.materiaId ?? asignacion.Materia?.MateriaID ?? null) ??
		null;
	const profesor =
		asignacion.Profesor ??
		profesoresMap.get(asignacion.ProfesorID ?? asignacion.profesorId ?? asignacion.Profesor?.ProfesorID ?? null) ??
		null;

	const horaInicio = asignacion.HoraInicio ?? asignacion.horaInicio ?? asignacion.Hora ?? null;
	const horaFin = asignacion.HoraFin ?? asignacion.horaFin ?? null;
	const bloque = construirBloqueHorario(horaInicio, horaFin);

	return {
		id:
			asignacion.HorarioID ??
			asignacion.id ??
			`${grupoId}-${asignacion.DiaSemana ?? asignacion.dia ?? ""}-${bloque}`,
		grupoId: Number(grupoId),
		dia: asignacion.DiaSemana ?? asignacion.dia ?? "",
		bloque,
		materia: materia?.Nombre ?? materia?.nombre ?? "",
		profesor: profesor?.Nombre ?? profesor?.nombre ?? "",
		aula: asignacion.Aula?.Nombre ?? asignacion.Aula?.nombre ?? asignacion.AulaNombre ?? "",
		horaInicio: formatearHora(horaInicio),
		horaFin: formatearHora(horaFin),
		referencia: asignacion
	};
};

const crearIndice = (lista, obtenerId = (item) => item.id) => {
	const mapa = new Map();
	lista.forEach((item) => {
		const id = obtenerId(item);
		if (id !== null && id !== undefined) {
			mapa.set(Number(id), item);
		}
	});
	return mapa;
};

const obtenerClaveSesion = (grupoId, fecha, dia, bloque) => {
	const grupoParte = grupoId ?? "todos";
	const bloqueParte = bloque && bloque.trim().length > 0 ? bloque : "General";
	return `${grupoParte}|${fecha}|${dia}|${bloqueParte}`;
};

const Asistencia = () => {
	const USE_MOCK = true;

	const fechaHoyInicial = useMemo(() => new Date().toISOString().split("T")[0], []);
	const [fechaSeleccionada, setFechaSeleccionada] = useState(fechaHoyInicial);
	const [grupoSeleccionado, setGrupoSeleccionado] = useState(null);
	const [bloqueSeleccionado, setBloqueSeleccionado] = useState("General");
	const [terminoBusqueda, setTerminoBusqueda] = useState("");
			const [soloPendientes, setSoloPendientes] = useState(false);
			const [asistencias, setAsistencias] = useState({});
			const [mostrarQR, setMostrarQR] = useState(false);

	const { data: alumnosRespuesta = { datos: [] }, isLoading: cargandoAlumnos } = useQuery({
		queryKey: ["alumnos"],
		queryFn: obtenerAlumnos,
		staleTime: 1000 * 60,
		initialData: { datos: mockData.alumnos },
		enabled: !USE_MOCK
	});

	const { data: gruposRespuesta = { datos: [] }, isLoading: cargandoGrupos } = useQuery({
		queryKey: ["grupos"],
		queryFn: obtenerGrupos,
		staleTime: 1000 * 60,
		initialData: { datos: mockData.grupos },
		enabled: !USE_MOCK
	});

	const { data: grupoAlumnosRespuesta = { datos: [] }, isLoading: cargandoAsignacionesGrupo } = useQuery({
		queryKey: ["grupo-alumnos", "asistencia"],
		queryFn: () => obtenerGrupoAlumnos(),
		staleTime: 1000 * 60,
		initialData: { datos: mockData.grupoAlumnos },
		enabled: !USE_MOCK
	});

	const { data: asignacionesRespuesta = { datos: [] }, isLoading: cargandoHorarios } = useQuery({
		queryKey: ["asignaciones", "asistencia"],
		queryFn: obtenerAsignaciones,
		staleTime: 1000 * 60,
		initialData: { datos: mockData.asignaciones },
		enabled: !USE_MOCK
	});

	const alumnosNormalizados = useMemo(() => {
		const origen = alumnosRespuesta?.datos ?? [];
		return origen.map(normalizarAlumno).filter(Boolean);
	}, [alumnosRespuesta]);

	const gruposNormalizados = useMemo(() => {
		const origen = gruposRespuesta?.datos ?? [];
		return origen.map(normalizarGrupo).filter(Boolean).sort((a, b) => a.nombre.localeCompare(b.nombre, "es", { sensitivity: "base" }));
	}, [gruposRespuesta]);

	useEffect(() => {
		if (grupoSeleccionado === null && gruposNormalizados.length > 0) {
			setGrupoSeleccionado(gruposNormalizados[0].id);
		}
	}, [grupoSeleccionado, gruposNormalizados]);

	const indiceAlumnos = useMemo(() => crearIndice(alumnosNormalizados, (alumno) => alumno.id), [alumnosNormalizados]);

	const materiasIndice = useMemo(() => {
		const origen = mockData.materias ?? [];
		return crearIndice(
			origen
				.map(normalizarMateria)
				.filter(Boolean),
			(materia) => materia.id
		);
	}, []);

	const profesoresIndice = useMemo(() => {
		const origen = mockData.profesores ?? [];
		return crearIndice(
			origen
				.map(normalizarProfesor)
				.filter(Boolean),
			(profesor) => profesor.id
		);
	}, []);

	const asignacionesNormalizadas = useMemo(() => {
		const origen = asignacionesRespuesta?.datos ?? [];
		return origen
			.map((asignacion) => normalizarAsignacion(asignacion, materiasIndice, profesoresIndice))
			.filter(Boolean);
	}, [asignacionesRespuesta, materiasIndice, profesoresIndice]);

	const alumnosPorGrupo = useMemo(() => {
		const mapa = new Map();
		const registros = grupoAlumnosRespuesta?.datos ?? [];

		registros.forEach((registro) => {
			const grupoId = registro.GrupoID ?? registro?.Grupo?.GrupoID ?? registro.grupoId ?? null;
			const alumnoId = registro.AlumnoID ?? registro?.Alumno?.AlumnoID ?? registro.alumnoId ?? null;
			if (grupoId === null || alumnoId === null) return;
			const normalizado = indiceAlumnos.get(Number(alumnoId)) ?? normalizarAlumno(registro.Alumno);
			if (!normalizado) return;
			const lista = mapa.get(Number(grupoId)) ?? [];
			if (!lista.some((alumno) => alumno.id === normalizado.id)) {
				lista.push(normalizado);
			}
			mapa.set(Number(grupoId), lista);
		});

		return mapa;
	}, [grupoAlumnosRespuesta, indiceAlumnos]);

	const diaSeleccionado = useMemo(() => {
		const fecha = new Date(fechaSeleccionada);
		if (Number.isNaN(fecha.getTime())) return "Lunes";
		return diasSemana[fecha.getDay()] ?? "Lunes";
	}, [fechaSeleccionada]);

	const clasesDelGrupo = useMemo(() => {
		if (!grupoSeleccionado) return [];
		return asignacionesNormalizadas.filter(
			(clase) => clase.grupoId === Number(grupoSeleccionado) && (!clase.dia || clase.dia === diaSeleccionado)
		);
	}, [asignacionesNormalizadas, grupoSeleccionado, diaSeleccionado]);

	const bloquesDisponibles = useMemo(() => {
		if (clasesDelGrupo.length === 0) return ["General"];
		const valores = new Set(clasesDelGrupo.map((clase) => clase.bloque || "General"));
		return Array.from(valores).sort();
	}, [clasesDelGrupo]);

	useEffect(() => {
		if (!bloquesDisponibles.includes(bloqueSeleccionado)) {
			setBloqueSeleccionado(bloquesDisponibles[0] ?? "General");
		}
	}, [bloquesDisponibles, bloqueSeleccionado]);

	const clasesSeleccionadas = useMemo(() => {
		if (bloqueSeleccionado === "General") return clasesDelGrupo;
		return clasesDelGrupo.filter((clase) => clase.bloque === bloqueSeleccionado);
	}, [clasesDelGrupo, bloqueSeleccionado]);

	const claseReferencia = clasesSeleccionadas[0] ?? clasesDelGrupo[0] ?? null;

		const grupoActual = useMemo(
			() => gruposNormalizados.find((grupo) => grupo.id === grupoSeleccionado) ?? null,
			[gruposNormalizados, grupoSeleccionado]
		);

	const alumnosSeleccionados = useMemo(() => {
		if (!grupoSeleccionado) return alumnosNormalizados;
		const lista = alumnosPorGrupo.get(Number(grupoSeleccionado)) ?? [];
		return [...lista].sort((a, b) => a.nombre.localeCompare(b.nombre, "es", { sensitivity: "base" }));
	}, [grupoSeleccionado, alumnosNormalizados, alumnosPorGrupo]);

	const claveSesion = useMemo(
		() => obtenerClaveSesion(grupoSeleccionado, fechaSeleccionada, diaSeleccionado, bloqueSeleccionado),
		[grupoSeleccionado, fechaSeleccionada, diaSeleccionado, bloqueSeleccionado]
	);

	const estadoActualSesion = asistencias[claveSesion] ?? {};

	const alumnosFiltrados = useMemo(() => {
		const termino = terminoBusqueda.trim().toLowerCase();
		return alumnosSeleccionados.filter((alumno) => {
			const estado = estadoActualSesion[alumno.id];
			if (soloPendientes && estado?.presente) {
				return false;
			}
			if (!termino) return true;
			return [alumno.nombre, alumno.matricula, alumno.email]
				.filter(Boolean)
				.some((campo) => campo.toLowerCase().includes(termino));
		});
	}, [alumnosSeleccionados, estadoActualSesion, terminoBusqueda, soloPendientes]);

	const totalAlumnos = alumnosSeleccionados.length;
	const totalPresentes = useMemo(
		() => alumnosSeleccionados.filter((alumno) => estadoActualSesion[alumno.id]?.presente).length,
		[alumnosSeleccionados, estadoActualSesion]
	);
	const totalAusentes = totalAlumnos - totalPresentes;
	const porcentajeAsistencia = totalAlumnos > 0 ? Math.round((totalPresentes / totalAlumnos) * 100) : 0;
	const totalComentarios = useMemo(
		() =>
			alumnosSeleccionados.filter((alumno) => {
				const estado = estadoActualSesion[alumno.id];
				return estado?.comentario && estado.comentario.trim().length > 0;
			}).length,
		[alumnosSeleccionados, estadoActualSesion]
	);

	const actualizarRegistro = (alumnoId, cambios) => {
		setAsistencias((prev) => {
			const sesion = prev[claveSesion] ?? {};
			const actual = sesion[alumnoId] ?? { presente: false, comentario: "" };
			const actualizado = { ...actual, ...cambios };
			const sesionActualizada = { ...sesion };
			const comentarioValido = actualizado.comentario?.trim() ?? "";
			if (!actualizado.presente && comentarioValido.length === 0) {
				delete sesionActualizada[alumnoId];
			} else {
				sesionActualizada[alumnoId] = {
					presente: Boolean(actualizado.presente),
					comentario: actualizado.comentario ?? ""
				};
			}
			if (Object.keys(sesionActualizada).length === 0) {
				const copia = { ...prev };
				delete copia[claveSesion];
				return copia;
			}
			return { ...prev, [claveSesion]: sesionActualizada };
		});
	};

	const alternarPresencia = (alumnoId) => {
		setAsistencias((prev) => {
			const sesion = prev[claveSesion] ?? {};
			const actual = sesion[alumnoId] ?? { presente: false, comentario: "" };
			const sesionActualizada = { ...sesion };
			const nuevoEstado = { ...actual, presente: !actual.presente };
			const comentarioValido = nuevoEstado.comentario?.trim() ?? "";
			if (!nuevoEstado.presente && comentarioValido.length === 0) {
				delete sesionActualizada[alumnoId];
			} else {
				sesionActualizada[alumnoId] = nuevoEstado;
			}
			if (Object.keys(sesionActualizada).length === 0) {
				const copia = { ...prev };
				delete copia[claveSesion];
				return copia;
			}
			return { ...prev, [claveSesion]: sesionActualizada };
		});
	};

	const registrarComentario = (alumnoId, comentario) => {
		actualizarRegistro(alumnoId, { comentario });
	};

	const marcarGrupoCompleto = (presente) => {
		setAsistencias((prev) => {
			if (alumnosSeleccionados.length === 0) return prev;
			if (presente) {
				const sesion = alumnosSeleccionados.reduce((acc, alumno) => {
					const existente = prev[claveSesion]?.[alumno.id];
					acc[alumno.id] = {
						presente: true,
						comentario: existente?.comentario ?? ""
					};
					return acc;
				}, {});
				return { ...prev, [claveSesion]: sesion };
			}

			const sesionActual = prev[claveSesion] ?? {};
			const nuevaSesion = {};
			Object.entries(sesionActual).forEach(([alumnoId, registro]) => {
				if (registro.comentario && registro.comentario.trim().length > 0) {
					nuevaSesion[alumnoId] = { presente: false, comentario: registro.comentario };
				}
			});

			if (Object.keys(nuevaSesion).length === 0) {
				const copia = { ...prev };
				delete copia[claveSesion];
				return copia;
			}
			return { ...prev, [claveSesion]: nuevaSesion };
		});
	};

	const limpiarSesion = () => {
		setAsistencias((prev) => {
			if (!(claveSesion in prev)) return prev;
			const copia = { ...prev };
			delete copia[claveSesion];
			return copia;
		});
	};

	const exportarCSV = () => {
		if (alumnosSeleccionados.length === 0) return;
		const filas = ["Orden,Alumno,Matricula,Correo,Estado,Comentario"];
		alumnosSeleccionados.forEach((alumno, indice) => {
			const estado = estadoActualSesion[alumno.id];
			const presente = estado?.presente ? "Presente" : "Ausente";
			const comentario = estado?.comentario ? estado.comentario.replace(/"/g, "'") : "";
			const valores = [
				indice + 1,
				`"${alumno.nombre}"`,
				`"${alumno.matricula ?? ""}"`,
				`"${alumno.email ?? ""}"`,
				presente,
				`"${comentario}"`
			];
			filas.push(valores.join(","));
		});

		const contenido = filas.join("\n");
		const blob = new Blob([contenido], { type: "text/csv;charset=utf-8;" });
		const enlace = document.createElement("a");
		const nombreGrupo = gruposNormalizados.find((grupo) => grupo.id === grupoSeleccionado)?.nombre ?? "sin-grupo";
		enlace.href = URL.createObjectURL(blob);
		enlace.download = `asistencia_${nombreGrupo.replace(/\s+/g, "-").toLowerCase()}_${fechaSeleccionada}.csv`;
		enlace.style.display = "none";
		document.body.appendChild(enlace);
		enlace.click();
		document.body.removeChild(enlace);
		URL.revokeObjectURL(enlace.href);
	};

	const estadoCarga = cargandoAlumnos || cargandoGrupos || cargandoAsignacionesGrupo || cargandoHorarios;

			const qrDatos = useMemo(() => {
				if (!grupoActual) return null;

				return {
					sessionId: claveSesion,
					grupo: grupoActual?.nombre ?? "",
					turno: grupoActual?.turno ?? "",
					fecha: fechaSeleccionada,
					bloque: bloqueSeleccionado,
					materia: claseReferencia?.materia ?? "",
					profesor: claseReferencia?.profesor ?? "",
					aula: claseReferencia?.aula ?? "",
					horaInicio: claseReferencia?.horaInicio ?? "",
					horaFin: claseReferencia?.horaFin ?? ""
				};
			}, [grupoActual, claveSesion, fechaSeleccionada, bloqueSeleccionado, claseReferencia]);

		const qrUrl = useMemo(() => {
			if (!qrDatos) return "";
			const payload = encodeURIComponent(JSON.stringify(qrDatos));
			return `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${payload}`;
		}, [qrDatos]);

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
				className="flex flex-col gap-6"
			>
				<div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
					<div className="space-y-2">
						<h2 className="titulo-seccion">Control de asistencia</h2>
						<p className="descripcion-suave max-w-2xl">
							Registra la asistencia por grupo, fecha y bloque horario. Marca rápidamente a todo el grupo, añade
							comentarios por alumno y obtén un resumen listo para exportar.
						</p>
					</div>
					<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
						<div className="tarjeta-suave space-y-1 p-4">
							<label className="etiqueta-formulario text-xs uppercase">Fecha</label>
							<input
								type="date"
								value={fechaSeleccionada}
								onChange={(evento) => setFechaSeleccionada(evento.target.value)}
								className="input-formulario"
							/>
						</div>
						<div className="tarjeta-suave space-y-1 p-4">
							<label className="etiqueta-formulario text-xs uppercase">Grupo</label>
							<select
								value={grupoSeleccionado ?? ""}
								onChange={(evento) => setGrupoSeleccionado(Number(evento.target.value) || null)}
								className="input-formulario"
							>
								<option value="">Selecciona un grupo</option>
								{gruposNormalizados.map((grupo) => (
									<option key={grupo.id} value={grupo.id}>
										{grupo.nombre} {grupo.turno ? `· ${grupo.turno}` : ""}
									</option>
								))}
							</select>
						</div>
						<div className="tarjeta-suave space-y-1 p-4">
							<label className="etiqueta-formulario text-xs uppercase">Bloque</label>
							<select
								value={bloqueSeleccionado}
								onChange={(evento) => setBloqueSeleccionado(evento.target.value)}
								className="input-formulario"
							>
								{bloquesDisponibles.map((bloque) => (
									<option key={bloque} value={bloque}>
										{bloque}
									</option>
								))}
							</select>
						</div>
					</div>
				</div>

				{claseReferencia && (
					<motion.div
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.4, ease: "easeOut", delay: 0.05 }}
						className="tarjeta-suave grid gap-4 p-4 sm:grid-cols-3"
					>
						<div>
							<p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400 dark:text-neutro-500">
								Materia
							</p>
							<p className="mt-1 text-sm font-medium text-slate-700 dark:text-neutro-200">
								{claseReferencia.materia || "Sin materia registrada"}
							</p>
						</div>
						<div>
							<p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400 dark:text-neutro-500">
								Profesor
							</p>
							<p className="mt-1 text-sm font-medium text-slate-700 dark:text-neutro-200">
								{claseReferencia.profesor || "Sin profesor asignado"}
							</p>
						</div>
						<div>
							<p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400 dark:text-neutro-500">
								Aula · Horario
							</p>
							<p className="mt-1 text-sm font-medium text-slate-700 dark:text-neutro-200">
								{claseReferencia.aula ? `${claseReferencia.aula} · ` : ""}
								{claseReferencia.bloque}
							</p>
						</div>
					</motion.div>
				)}
			</motion.header>

			<section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
				<TarjetaAnimada
					initial={{ opacity: 0, y: 12 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.35, ease: "easeOut" }}
					className="tarjeta-suave p-5"
				>
					<p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400 dark:text-neutro-500">
						Total alumnos
					</p>
					<p className="mt-2 text-3xl font-semibold text-slate-900 dark:text-neutro-50">{totalAlumnos}</p>
					<p className="text-sm text-slate-500 dark:text-neutro-300">Miembros registrados en el grupo.</p>
				</TarjetaAnimada>

				<TarjetaAnimada
					initial={{ opacity: 0, y: 12 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.35, ease: "easeOut", delay: 0.05 }}
					className="tarjeta-suave p-5"
				>
					<p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400 dark:text-neutro-500">
						Presentes
					</p>
					<p className="mt-2 text-3xl font-semibold text-emerald-600 dark:text-esmeralda-400">{totalPresentes}</p>
					<p className="text-sm text-slate-500 dark:text-neutro-300">{porcentajeAsistencia}% de asistencia.</p>
				</TarjetaAnimada>

				<TarjetaAnimada
					initial={{ opacity: 0, y: 12 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.35, ease: "easeOut", delay: 0.1 }}
					className="tarjeta-suave p-5"
				>
					<p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400 dark:text-neutro-500">
						Ausentes
					</p>
					<p className="mt-2 text-3xl font-semibold text-rose-500 dark:text-rose-400">{totalAusentes}</p>
					<p className="text-sm text-slate-500 dark:text-neutro-300">Pendientes por confirmar asistencia.</p>
				</TarjetaAnimada>

				<TarjetaAnimada
					initial={{ opacity: 0, y: 12 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.35, ease: "easeOut", delay: 0.15 }}
					className="tarjeta-suave p-5"
				>
					<p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400 dark:text-neutro-500">
						Comentarios
					</p>
					<p className="mt-2 text-3xl font-semibold text-slate-900 dark:text-neutro-50">{totalComentarios}</p>
					<p className="text-sm text-slate-500 dark:text-neutro-300">Observaciones registradas en la sesión.</p>
				</TarjetaAnimada>
			</section>

			<motion.section
				initial={{ opacity: 0, y: 18 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.45, ease: "easeOut", delay: 0.05 }}
				className="tarjeta-suave overflow-hidden"
			>
				<div className="flex flex-col gap-4 border-b border-slate-100 bg-white/90 px-6 py-5 dark:border-oscuro-200/60 dark:bg-oscuro-200/70 sm:flex-row sm:items-center sm:justify-between">
					<div>
						<h3 className="text-lg font-semibold text-slate-900 dark:text-neutro-50">Lista de asistencia</h3>
						<p className="text-sm text-slate-500 dark:text-neutro-300">
							{estadoCarga ? "Sincronizando registros..." : `${alumnosFiltrados.length} alumnos listados`}
						</p>
					</div>

					<div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
						<div className="relative sm:w-64">
							<input
								type="search"
								placeholder="Busca por nombre, matrícula o correo"
								value={terminoBusqueda}
								onChange={(evento) => setTerminoBusqueda(evento.target.value)}
								className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 pr-10 text-sm font-medium text-slate-600 shadow-sm transition focus:border-primario-500 focus:outline-none focus:ring-2 focus:ring-primario-500/30 dark:border-oscuro-300 dark:bg-oscuro-200/60 dark:text-neutro-200 dark:focus:border-esmeralda-500 dark:focus:ring-esmeralda-500/30"
							/>
						</div>
						<label className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 dark:border-oscuro-300 dark:bg-oscuro-200/60 dark:text-neutro-200">
							<input
								type="checkbox"
								checked={soloPendientes}
								onChange={(evento) => setSoloPendientes(evento.target.checked)}
								className="h-4 w-4 rounded border-slate-300 text-primario-500 focus:ring-primario-500 dark:border-oscuro-300 dark:bg-oscuro-100"
							/>
							Mostrar solo pendientes
						</label>
					</div>
				</div>

				<div className="flex flex-col gap-3 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
					<div className="flex flex-wrap gap-2">
												<button
													type="button"
													className="boton-principal bg-primario-600 text-white shadow-lg shadow-primario-500/30 transition hover:bg-primario-700 focus:outline-none focus:ring-4 focus:ring-primario-500/40 dark:bg-esmeralda-500 dark:text-oscuro-900 dark:hover:bg-esmeralda-400"
													onClick={() => marcarGrupoCompleto(true)}
													disabled={alumnosSeleccionados.length === 0}
												>
													Marcar todo como presente
												</button>
												<button
													type="button"
													className="boton-secundario border border-primario-200 bg-white text-primario-600 shadow-sm transition hover:border-primario-400 hover:bg-primario-50 hover:text-primario-700 focus:outline-none focus:ring-4 focus:ring-primario-400/40 dark:border-esmeralda-500/40 dark:bg-oscuro-300/60 dark:text-esmeralda-400 dark:hover:bg-oscuro-200/80"
													onClick={() => marcarGrupoCompleto(false)}
													disabled={alumnosSeleccionados.length === 0}
												>
													Desmarcar presentes
												</button>
												<button
													type="button"
													className="boton-secundario border border-rose-300 bg-white text-rose-500 shadow-sm transition hover:border-rose-400 hover:bg-rose-50 hover:text-rose-600 focus:outline-none focus:ring-4 focus:ring-rose-300/40 dark:border-rose-400/60 dark:bg-oscuro-300/60 dark:text-rose-300"
													onClick={limpiarSesion}
													disabled={!(claveSesion in asistencias)}
												>
													Limpiar sesión
												</button>
					</div>
											<div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
												<button
													type="button"
													className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-400/40 dark:bg-indigo-500"
													onClick={() => setMostrarQR(true)}
													disabled={!qrDatos}
												>
													Generar código QR de la sesión
												</button>
												<button
													type="button"
													className="boton-auxiliar bg-amber-500 px-5 py-2.5 text-white shadow-md transition hover:bg-amber-600 focus:outline-none focus:ring-4 focus:ring-amber-400/40 dark:bg-amber-400 dark:text-oscuro-900"
													onClick={exportarCSV}
													disabled={alumnosSeleccionados.length === 0}
												>
													Exportar CSV
												</button>
											</div>
				</div>

				<div className="overflow-x-auto">
					<table className="min-w-full divide-y divide-slate-200 dark:divide-oscuro-300">
						<thead className="bg-slate-50/80 dark:bg-oscuro-200/60">
							<tr className="text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-neutro-400">
								<th className="px-4 py-3">#</th>
								<th className="px-4 py-3">Alumno</th>
								<th className="px-4 py-3">Matrícula</th>
								<th className="px-4 py-3">Correo</th>
								<th className="px-4 py-3">Asistencia</th>
								<th className="px-4 py-3">Comentario</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-slate-100 bg-white/90 dark:divide-oscuro-300 dark:bg-oscuro-200/60">
							{alumnosFiltrados.length === 0 && (
								<tr>
									<td colSpan={6} className="px-4 py-6 text-center text-sm font-medium text-slate-500 dark:text-neutro-300">
										{alumnosSeleccionados.length === 0
											? "No hay alumnos asignados a este grupo."
											: "Ningún alumno coincide con la búsqueda actual."}
									</td>
								</tr>
							)}

							{alumnosFiltrados.map((alumno, indice) => {
								const estado = estadoActualSesion[alumno.id];
								const presente = estado?.presente ?? false;
								return (
									<tr key={alumno.id} className={presente ? "bg-emerald-50/50 dark:bg-esmeralda-500/10" : ""}>
										<td className="px-4 py-3 text-sm font-semibold text-slate-500 dark:text-neutro-400">{indice + 1}</td>
										<td className="px-4 py-3 text-sm font-semibold text-slate-800 dark:text-neutro-100">{alumno.nombre}</td>
										<td className="px-4 py-3 text-sm text-slate-600 dark:text-neutro-300">{alumno.matricula || "—"}</td>
										<td className="px-4 py-3 text-sm text-slate-600 dark:text-neutro-300">{alumno.email || "—"}</td>
										<td className="px-4 py-3">
											<label className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-neutro-200">
												<input
													type="checkbox"
													checked={presente}
													onChange={() => alternarPresencia(alumno.id)}
													className="h-5 w-5 rounded border-slate-300 text-primario-500 focus:ring-primario-500 dark:border-oscuro-300 dark:bg-oscuro-100"
												/>
												{presente ? "Presente" : "Ausente"}
											</label>
										</td>
										<td className="px-4 py-3">
											<input
												type="text"
												value={estado?.comentario ?? ""}
												onChange={(evento) => registrarComentario(alumno.id, evento.target.value)}
												placeholder="Observación opcional"
												className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm transition focus:border-primario-500 focus:outline-none focus:ring-2 focus:ring-primario-500/30 dark:border-oscuro-300 dark:bg-oscuro-200/80 dark:text-neutro-100 dark:focus:border-esmeralda-500 dark:focus:ring-esmeralda-500/30"
											/>
										</td>
									</tr>
								);
							})}
						</tbody>
					</table>
				</div>
			</motion.section>

													{mostrarQR && qrUrl && (
									<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
										<div className="w-full max-w-md rounded-2xl bg-white p-6 text-center shadow-2xl dark:bg-oscuro-100">
																<h4 className="text-lg font-semibold text-slate-900 dark:text-neutro-50">Código QR de la sesión</h4>
																<p className="mt-2 text-sm text-slate-500 dark:text-neutro-300">
																	Comparte este código con los alumnos para registrar la asistencia del grupo {grupoActual?.nombre ?? ""}
																	{claseReferencia?.materia ? ` (${claseReferencia.materia})` : ""} el {fechaSeleccionada}.
																</p>
																<div className="mt-4 space-y-1 text-xs text-slate-500 dark:text-neutro-300">
																	<p><strong>Turno:</strong> {grupoActual?.turno || "--"}</p>
																	<p><strong>Bloque:</strong> {bloqueSeleccionado}</p>
																	{claseReferencia?.profesor && <p><strong>Profesor:</strong> {claseReferencia.profesor}</p>}
																	{claseReferencia?.aula && <p><strong>Aula:</strong> {claseReferencia.aula}</p>}
																</div>
																<div className="mt-5 flex justify-center">
																	<img src={qrUrl} alt="Código QR de la sesión" className="h-60 w-60 rounded-2xl border border-slate-200 shadow-inner" />
											</div>
											<button
												type="button"
												className="mt-6 inline-flex items-center justify-center rounded-xl bg-primario-600 px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:bg-primario-700 focus:outline-none focus:ring-4 focus:ring-primario-500/40 dark:bg-esmeralda-500 dark:text-oscuro-900"
																	onClick={() => setMostrarQR(false)}
											>
												Cerrar
											</button>
										</div>
									</div>
								)}
		</ContenedorAnimado>
	);
};

export default Asistencia;
