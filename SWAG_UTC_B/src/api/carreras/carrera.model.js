import { DataTypes } from 'sequelize';
import { conexion } from '../../config/db.js';

export const Carrera = conexion.define(
  'Carrera',
  {
    CarreraID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    Clave: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true
    },
    Nombre: {
      type: DataTypes.STRING(120),
      allowNull: false
    },
    Descripcion: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    Activo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    }
  },
  {
    tableName: 'Carreras',
    timestamps: false
  }
);

export default Carrera;
