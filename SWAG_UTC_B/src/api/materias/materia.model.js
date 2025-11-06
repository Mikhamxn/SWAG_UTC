import { DataTypes } from 'sequelize';
import { conexion } from '../../config/db.js';

export const Materia = conexion.define(
  'Materia',
  {
    intMateria: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    strClave: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    },
    strNombre: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    intTotalSesiones: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: true,
        min: 1
      }
    }
  },
  {
    tableName: 'tblMaterias',
    timestamps: false
  }
);

export default Materia;
