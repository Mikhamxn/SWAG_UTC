# 🚀 Sistema Web de Gestión de Asistencias (SWGA) - Hackatón

## 1. Visión General del Proyecto

El **Sistema Web de Gestión de Asistencias (SWGA)** es una aplicación diseñada para automatizar y validar el registro de asistencia en un entorno académico. El proyecto se centra en ofrecer un sistema **robusto y auditable** capaz de manejar un alto volumen de transacciones de registro mediante **código QR** y **validación biométrica (Face ID)**.

### 1.1. Stack Tecnológico (Definición de Componentes)

Hemos optado por un *stack* moderno y escalable, favoreciendo la integridad de los datos.

| Componente | Tecnología | Propósito |
| :--- | :--- | :--- |
| **Base de Datos** | **PostgreSQL (v17) en Docker** | SGBD robusto, conocido por su integridad transaccional y escalabilidad, ideal para el alto volumen de registros de asistencia. |
| **Backend (API)** | **Node.js con Express.js** | (Asumiendo Node.js como la elección más rápida para Hackatón). Plataforma rápida y asíncrona, perfecta para manejar las peticiones concurrentes de escaneo de QR y validación de Face ID. |
| **ORM / Cliente DB** | Sequelize (Recomendado) / pgAdmin 4 | ORM para interactuar con PostgreSQL / Administración visual de la base de datos. |

---

## 2. Diseño de la Base de Datos (DB)

El diseño se basa en el **Modelo Entidad-Relación (MER)** provisto, priorizando la **separación** entre el registro de eventos crudos y la asistencia final procesada.

### 2.1. Estructura de Tablas Clave

El esquema está optimizado para auditar los intentos de registro y las asistencias finales.

| Tabla | Función Principal | Campo Crítico | Notas |
| :--- | :--- | :--- | :--- |
| **`TblMarcajeRaw`** | **Registro crudo de cada intento de escaneo** (QR/Face ID). Es la tabla de mayor volumen. | `dtHoraMarcaje` | Es el *log* de eventos de entrada/salida. |
| **`TblAsistencias`** | **Registro formal y final** de la asistencia de un alumno a una sesión (ya procesada y validada). | `IntSesionClase` + `IntAlumno` | Asegura la unicidad de la asistencia por sesión. |
| **`TblGrupos`** | Une profesores y materias con una cohorte de alumnos (`TblAlumnosGrupos`). | `IntProfesor` | Centraliza la asignación. |
| **`TblDevices`** | Catálogo de los dispositivos de escaneo (para auditoría y geolocalización). | `strDeviceSN` | Permite verificar si el marcaje vino de un dispositivo autorizado. |

### 2.2. Estrategia de Indexación para Rendimiento (PostgreSQL)

Para garantizar un rendimiento óptimo en la validación y el *reporting*, se implementaron índices específicos:

| Índice | Propósito | Declaración SQL |
| :--- | :--- | :--- |
| `idx_alumnos_matricula` | Búsqueda rápida de identidad de alumnos. | `CREATE UNIQUE INDEX idx_alumnos_matricula ON TblAlumnos (strMatricula);` |
| `idx_devices_sn` | Búsqueda de dispositivos para auditoría. | `CREATE UNIQUE INDEX idx_devices_sn ON TblDevices (strDeviceSN);` |
| **`idx_asistencias_sesion_alumno`** | **Optimización de la atomicidad:** Garantiza que un alumno solo tenga una asistencia por sesión de clase. | `CREATE UNIQUE INDEX idx_asistencias_sesion_alumno ON TblAsistencias (IntSesionClase, IntAlumno);` |
| `idx_marcaje_hora` | Optimización de consultas sobre el *log* de marcajes, permitiendo filtros rápidos por fecha/hora. | `CREATE INDEX idx_marcaje_hora ON TblMarcajeRaw (dtHoraMarcaje);` |

---

## 3. Funcionalidades Clave de la API (Backend Node.js)

La API debe gestionar la lógica de validación y la interacción de los diferentes roles de usuario.

### 3.1. Flujo de Asistencia (Core)

| Endpoint | Método | Lógica de Negocio |
| :--- | :--- | :--- |
| `/api/marcar` | `POST` | 1. Recibe datos de escaneo (QR/Face ID data, `strDeviceSN`, Alumno Token). 2. Inserta el registro en **`TblMarcajeRaw`**. 3. Lógica de validación de tiempo y geolocalización. 4. Si es válido, inserta el registro final en **`TblAsistencias`**. |
| `/api/qr/generate` | `GET` | Genera el Código QR dinámico de la sesión actual (vinculado a `IntSesionClase`). Requiere autenticación de Profesor. |

### 3.2. Módulos de Gestión (CRUD)

| Módulo | Endpoints (Rutas base) | Rol Requerido |
| :--- | :--- | :--- |
| **Administración** | `/api/admin/...` | Administrador |
| **Grupos & Horarios** | `/api/horarios` | Coordinador / Administrador |
| **Reportes** | `/api/reportes/asistencia` | Profesor / Administrador |
| **Justificaciones** | `/api/justificaciones` | Alumno (crear) / Profesor (aprobar) |

---

## 4. Instrucciones de Implementación (Docker)

1. **Clonar Repositorio:** `git clone https://aws.amazon.com/es/what-is/repo/`
2. **Configuración de Entorno:** Llenar el archivo `.env` con la configuración de PostgreSQL.
3. **Levantar DB:** `docker-compose up -d postgres`
4. **Instalar Dependencias (Node.js):** `npm install`
5. **Iniciar Backend:** `npm start`
