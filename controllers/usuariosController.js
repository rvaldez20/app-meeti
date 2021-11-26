const Usuarios = require('../models/Usuarios');
const enviarEmail = require('../handlers/emails');

exports.formCrearCuenta = (req, res) => {
   res.render('crear-cuenta', {
      nombrePagina: 'Crear tu Cuenta'
   })
}

exports.crearNuevaCuenta = async (req, res) => {
   const usuario =  req.body;
   // console.log(password)

   req.checkBody('repetir', 'El Password confirmado no puede ir vacio').notEmpty();   
   req.checkBody('repetir', 'El Password es diferente').equals(req.body.password);

   // Leer errores de express validator
   const erroresExpress = req.validationErrors();
   // console.log(erroresExpress);

   try {

      await Usuarios.create(usuario);

      // generar URL de confirmacion
      const url = `http://${req.headers.host}/confirmar-cuenta/${usuario.email}`;

      // enviar Email de confirmación
      await enviarEmail.enviarEmail({
         usuario,
         url,
         subject: 'Confirma tu cuenta de Meeti',
         archivo: 'confirmar-cuenta'
      })


      //Flash Message
      // console.log('Usuario Creado', nuevoUsuario);

      req.flash('exito', 'Hemos enviado un email, confirma tu cuenta');
      res.redirect('/iniciar-sesion');

   } catch (error) {
      // console.log(error)

      // extraer unicamente el message de lo serores de errores de sequilize
      const erroresSeequelize = error.errors.map( err => err.message);
      //console.log(erroresSeequelize);
     

      // extraer unicamente el msg de lo serores de express      
      const errExp = erroresExpress.map( err => err.msg);
      //console.log(errExp);
   

      //unir las 2 lista de errores
      const listaErrores = [...erroresSeequelize, ...errExp];
      //console.log(listaErrores);


      // mostramos los errores con req.flash
      req.flash('error', listaErrores);
      res.redirect('/crear-cuenta');
   }

}

// confirma la suscripcion del usuraio (cuando hacen click en el enalce que se encia al correo)
exports.confirmarCuenta = async (req, res, next) => {
   // recibimos lo sparametros
   const {email} = req.params;
   
   //verificar que el usuario existe (por el correo)
   const usuario = await Usuarios.findOne({where: {email}})

   // si no existe, redireccionar
   if (!usuario) {
      req.flash('error', 'El usuario no esta registrado');
      res.redirect('/crear-cuenta');
      return next();
   }

   // si existe confirmar suscripcion
   console.log(usuario)
   usuario.activo = 1;
   await usuario.save();

   // redireccionamos
   req.flash('exito', 'La cuenta se confirmo satisfactoriamente, ya puedes inciar sesión')
   res.redirect('/iniciar-sesion');
}

//Formulario para iniciar sesion
exports.formIniciarSesion = (req, res) => {
   res.render('iniciar-sesion', {
      nombrePagina: 'Inciar Sesión'
   })
}