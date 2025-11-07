import { DataTypes } from 'sequelize';
import { conexion } from '../../config/db.js';

export const Profesor = conexion.define(
  'Profesor',
  {
    ProfesorID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    Admin: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
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
      type: DataTypes.STRING(100),
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
    tableName: 'Profesores',
    timestamps: false
  }
);

export default Profesor;
