const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const Usuarios = require('../models/Usuarios');

passport.use(new LocalStrategy({
   usernameField: 'email',
   passwordField: 'password'
   },
   async(email, password, next) => {
      // este codigo se ejecuta al llenar el formulario
      const usuario = await Usuarios.findOne({ 
         where: {email}
      });

      // revisar si el usuario con ese email esta registrado
                             //null no error , false  no hubo usuario
      if(!usuario) return next(null, false, {
         message: 'Ese usuario no existe'
      })

      // Se verifica si el cliente ya activo su cuenta
      if(usuario.activo === 0) return next(null, false, {
         message: 'Es necesario activar tu cuenta, revisa tu correo'
      })

      // si el usuario existe comparar el password
      const verificarPass = usuario.validarPassword(password);

      // si el password es incorrecto
      if(!verificarPass) return next(null, false, {
         message: 'Password incorrecto'
      })

      // si todo bien usuario existe y password correcto
      return next(null, usuario);

   }
))

passport.serializeUser(function(usuario, cb) {
   cb(null, usuario);
});

passport.deserializeUser(function(usuario, cb) {
   cb(null, usuario);
});

module.exports = passport;

