const { DataTypes } = require('sequelize');
const db = require('../config/db');
const { v4: uuid4 } = require('uuid');
const Categorias = require('../models/Categorias');
const Usuarios = require('../models/Usuarios');

const Grupos = db.define('grupos', {
   id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: uuid4()
   },
   nombre:{
      type: DataTypes.TEXT(100),
      allowNull: false,
      validate: {
         notEmpty: {
            msg: 'El Grupo debe tener un nombre'
         }
      }
   },
   descripcion: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
         notEmpty: {
            msg: 'Es necesaria una descripción del Grupo'
         }
      }
   },
   url: {
      type: DataTypes.TEXT
   },
   imagen: {
      type: DataTypes.TEXT,
      allowNull: true,
   }
});

/*
La asociación A.belongsTo(B) donde A=Grupos | B=Categorias
Significa que existe una relación uno a uno entre A y B, con la clave externa definida en el modelo de origen (A).

Cada Grupo tendra una Categoria
Cada Grupo tendra un usuario (es el que lo crea)
*/

Grupos.belongsTo(Categorias);
Grupos.belongsTo(Usuarios);

module.exports = Grupos;