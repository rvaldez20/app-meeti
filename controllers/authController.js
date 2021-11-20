const passport = require('passport')

exports.autenticarUsuario = passport.authenticate('local', {
   successRedirect: '/administracion',
   failureRedirect: '/iniciar-sesion',
   failureFlash: true,
   badRequestMessage: 'Ambos campos son obligatorios'
});

// revisar si el usuario esta autenticado
exports.usuarioAutenticado = (req, res, next) => {
   // si el usuario esta aautenticado adelante o hay problema
   if(req.isAuthenticated()) {
      // si esta autenticado pasa al siguiente middleware (panel de administracion)
      return next()
   }

   // si no esta autenticado
   return res.redirect('/iniciar-sesion');
}