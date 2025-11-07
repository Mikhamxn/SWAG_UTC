import { DataTypes } from 'sequelize';
import { conexion } from '../../config/db.js';

export const Alumno = conexion.define(
  'Alumno',
  {
    AlumnoID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    Nombre: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    Apellido: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    Email: {
      type: DataTypes.STRING(108),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    Activo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    }
  },
  {
    tableName: 'Alumnos',
    timestamps: false
  }
);

export default Alumno;
