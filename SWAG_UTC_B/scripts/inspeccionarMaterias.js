import { conexion } from "../src/config/db.js";

const ejecutar = async () => {
  try {
    await conexion.authenticate();
    const info = await conexion.getQueryInterface().describeTable("Materias");
    console.log("Columnas en Materias:");
    console.log(info);
  } catch (error) {
    console.error("Fallo al inspeccionar la tabla Materias:", error);
  } finally {
    await conexion.close();
  }
};

ejecutar();
