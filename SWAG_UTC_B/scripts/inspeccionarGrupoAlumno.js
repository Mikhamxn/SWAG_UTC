import { conexion } from "../src/config/db.js";

const ejecutar = async () => {
  try {
    await conexion.authenticate();
    const info = await conexion.getQueryInterface().describeTable("GrupoAlumno");
    console.log("Columnas en GrupoAlumno:");
    console.log(info);
  } catch (error) {
    console.error("Fallo al inspeccionar la tabla GrupoAlumno:", error);
  } finally {
    await conexion.close();
  }
};

ejecutar();
