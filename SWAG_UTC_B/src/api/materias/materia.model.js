import { DataTypes } from 'sequelize';
import { conexion } from '../../config/db.js';

export const Materia = conexion.define(
  'Materia',
  {
    MateriaID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    Nombre: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    Descripcion: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    Activo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    }
  },
  {
    tableName: 'Materias',
    timestamps: false
  }
);

export default Materia;
