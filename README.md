# 🚀 Sistema Web de Gestión de Asistencias (SWGA) - Hackatón

## 1. Visión General del Proyecto

El **Sistema Web de Gestión de Asistencias (SWGA)** es una aplicación diseñada para automatizar y validar el registro de asistencia en un entorno académico, utilizando **código QR** y **validación biométrica (Face ID)**.

### 1.1. Stack Tecnológico (Definición de Componentes)

Hemos optado por un *stack* robusto, utilizando la base de datos SQL Server.

| Componente | Tecnología | Propósito |
| :--- | :--- | :--- |
| **Base de Datos** | **SQL Server** | SGBD empresarial robusto para garantizar la integridad y escalabilidad de los registros de asistencia de alto volumen. |
| **Backend (API)** | **Node.js con Express.js** | Plataforma rápida y asíncrona, ideal para manejar las peticiones concurrentes de escaneo de QR y validación de Face ID. |
| **ORM / Cliente DB** | `mssql` (Driver) / Azure Data Studio | Driver para interactuar con SQL Server / Administración visual de la base de datos. |

---

## 2. Diseño de la Base de Datos (DB)

El diseño se basa en el **Modelo Entidad-Relación (MER)** provisto, optimizado para auditar los intentos de registro (`TblMarcajeRaw`) y las asistencias finales (`TblAsistencias`).

### 2.1. Estructura de Tablas Clave

El esquema está diseñado para la **separación** entre el registro de eventos crudos y la asistencia final procesada.

| Tabla | Función Principal | Campo Crítico | Notas |
| :--- | :--- | :--- | :--- |
| **`TblMarcajeRaw`** | **Registro crudo de cada intento de escaneo** (QR/Face ID). Es la tabla de mayor volumen. | `dtHoraMarcaje` | Es el *log* de eventos de entrada/salida. |
| **`TblAsistencias`** | **Registro formal y final** de la asistencia de un alumno a una sesión (ya procesada y validada). | `IntSesionClase` + `IntAlumno` | Asegura la unicidad de la asistencia por sesión. |
| **`TblGrupos`** | Une profesores y materias con una cohorte de alumnos (`TblAlumnosGrupos`). | `IntProfesor` | Centraliza la asignación. |
| **`TblDevices`** | Catálogo de los dispositivos de escaneo (para auditoría). | `strDeviceSN` | Permite verificar si el marcaje vino de un dispositivo autorizado. |

### 2.2. Estrategia de Indexación para Rendimiento (SQL Server)

Se han añadido índices específicos para acelerar las consultas más frecuentes en un sistema de asistencia:

```sql
-- Búsqueda de identidad (UNIQUE CLUSTERED INDEX recomendado para PK en SQL Server)
-- Asumiendo TblAlumnos.strMatricula NO es la PK, sino un campo indexado:
CREATE UNIQUE NONCLUSTERED INDEX idx_alumnos_matricula ON TblAlumnos (strMatricula);
CREATE UNIQUE NONCLUSTERED INDEX idx_devices_sn ON TblDevices (strDeviceSN);

-- Optimización de alto volumen (Asistencias)
-- Índice Único para garantizar la atomicidad del registro:
CREATE UNIQUE NONCLUSTERED INDEX idx_asistencias_sesion_alumno 
ON TblAsistencias (IntSesionClase, IntAlumno);

-- Índice para consultas rápidas por hora/fecha
CREATE NONCLUSTERED INDEX idx_marcaje_hora ON TblMarcajeRaw (dtHoraMarcaje);
