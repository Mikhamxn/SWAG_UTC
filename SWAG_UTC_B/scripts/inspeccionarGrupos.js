import { conexion } from "../src/config/db.js";

const ejecutar = async () => {
  try {
    await conexion.authenticate();
    const info = await conexion.getQueryInterface().describeTable("Grupos");
    console.log("Columnas en Grupos:");
    console.log(info);
  } catch (error) {
    console.error("Fallo al inspeccionar la tabla Grupos:", error);
  } finally {
    await conexion.close();
  }
};

ejecutar();
