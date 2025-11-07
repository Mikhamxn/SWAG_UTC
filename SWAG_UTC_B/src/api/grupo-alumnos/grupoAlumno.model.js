import { DataTypes } from 'sequelize';
import { conexion } from '../../config/db.js';
import { Grupo } from '../grupos/grupo.model.js';
import { Alumno } from '../alumnos/alumno.model.js';

export const GrupoAlumno = conexion.define(
  'GrupoAlumno',
  {
    GrupoID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: Grupo,
        key: 'GrupoID'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    AlumnoID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: Alumno,
        key: 'AlumnoID'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    Activo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    }
  },
  {
    tableName: 'GrupoAlumno',
    timestamps: false
  }
);

Grupo.belongsToMany(Alumno, {
  through: GrupoAlumno,
  foreignKey: 'GrupoID',
  otherKey: 'AlumnoID',
  as: 'Alumnos'
});

Alumno.belongsToMany(Grupo, {
  through: GrupoAlumno,
  foreignKey: 'AlumnoID',
  otherKey: 'GrupoID',
  as: 'Grupos'
});

GrupoAlumno.belongsTo(Grupo, { foreignKey: 'GrupoID', as: 'Grupo' });
GrupoAlumno.belongsTo(Alumno, { foreignKey: 'AlumnoID', as: 'Alumno' });

export default GrupoAlumno;
