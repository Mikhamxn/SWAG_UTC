/**
 * @typedef {Object} AtributosMateria
 * @property {number} intMateria Identificador único generado automáticamente.
 * @property {string} strClave Clave única de la materia.
 * @property {string} strNombre Nombre legible de la materia.
 * @property {number} intTotalSesiones Total de sesiones asignadas a la materia.
 */

/**
 * @typedef {Object} AtributosCreacionMateria
 * @property {string} strClave
 * @property {string} strNombre
 * @property {number} intTotalSesiones
 */

export const materiaInterfaz = Object.freeze({
  identificador: 'intMateria',
  clave: 'strClave',
  nombre: 'strNombre',
  totalSesiones: 'intTotalSesiones'
});

export default materiaInterfaz;
