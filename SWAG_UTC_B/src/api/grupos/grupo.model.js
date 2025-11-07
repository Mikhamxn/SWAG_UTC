import { DataTypes } from 'sequelize';
import { conexion } from '../../config/db.js';
import { Carrera } from '../carreras/carrera.model.js';

export const Grupo = conexion.define(
  'Grupo',
  {
    GrupoID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    CarreraID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Carrera,
        key: 'CarreraID'
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT'
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
    Turno: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    Activo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    }
  },
  {
    tableName: 'Grupos',
    timestamps: false
  }
);

Carrera.hasMany(Grupo, { foreignKey: 'CarreraID', as: 'Grupos' });
Grupo.belongsTo(Carrera, { foreignKey: 'CarreraID', as: 'Carrera' });

export default Grupo;
