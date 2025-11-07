import { DataTypes } from 'sequelize';
import { conexion } from '../../config/db.js';
import { Materia } from '../materias/materia.model.js';
import { Profesor } from '../profesores/profesor.model.js';
import { Grupo } from '../grupos/grupo.model.js';

export const Horario = conexion.define(
  'Horario',
  {
    HorarioID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    MateriaID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Materia,
        key: 'MateriaID'
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT'
    },
    GrupoID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Grupo,
        key: 'GrupoID'
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT'
    },
    ProfesorID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Profesor,
        key: 'ProfesorID'
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT'
    },
    DiaSemana: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    HoraInicio: {
      type: DataTypes.TIME,
      allowNull: false
    },
    HoraFin: {
      type: DataTypes.TIME,
      allowNull: false
    },
    CodigoQRClase: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    Activo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    }
  },
  {
    tableName: 'Horarios',
    timestamps: false
  }
);

Materia.hasMany(Horario, { foreignKey: 'MateriaID', as: 'Horarios' });
Horario.belongsTo(Materia, { foreignKey: 'MateriaID', as: 'Materia' });

Profesor.hasMany(Horario, { foreignKey: 'ProfesorID', as: 'Horarios' });
Horario.belongsTo(Profesor, { foreignKey: 'ProfesorID', as: 'Profesor' });

Grupo.hasMany(Horario, { foreignKey: 'GrupoID', as: 'Horarios' });
Horario.belongsTo(Grupo, { foreignKey: 'GrupoID', as: 'Grupo' });

export default Horario;
