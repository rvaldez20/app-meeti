const { Sequelize, DataTypes } = require('sequelize');
const db = require('../config/db');
const bcrypt = require('bcryptjs');

// se define el modelo
const Usuarios = db.define('usuarios', {
   id:{
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
   },
   nombre: {
      type: DataTypes.STRING(60)
   },
   imagen: {
      type: DataTypes.STRING(60),
   },
   email: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
         isEmail: { msg: 'Agrega un correo valido' }
      },
      unique: {
         args: true,
         msg: 'Usuario ya registrado'
      },
   },
   password: {
      type: DataTypes.STRING(60),
      allowNull: false,
      validate: {
         notEmpty: {
            msg: 'El Password no puede ir vacio'
         }
      }
   },
   activo: {
      type: DataTypes.INTEGER,
      defaultValue: 0
   },
   tokenPassword: {
      type: DataTypes.STRING
   },
   expiraToken: {
      type: DataTypes.DATE
   }
}, {
   freezeTableName: true,
   timestamps: true,
   hooks: {
      beforeCreate(usuario) {
         const salt = bcrypt.genSaltSync(10);
         usuario.password = bcrypt.hashSync(usuario.password, salt);
      }
   }
});


// Metodo para comparar password (password es el que vide del fornt del formulario)
Usuarios.prototype.validarPassword = function(password) {
   return bcrypt.compareSync(password, this.password);
}

module.exports = Usuarios;