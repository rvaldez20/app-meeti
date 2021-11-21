const { DataTypes } = require('sequelize');
const db = require('../config/db');

const Categorias =  db.define('categorias', {
   id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
   },
   nombre: {
      type: DataTypes.TEXT
   }
});

module.exports = Categorias;
