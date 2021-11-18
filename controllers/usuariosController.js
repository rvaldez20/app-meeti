const Usuarios = require('../models/Usuarios');
const enviarEmail = require('../handlers/emails');

exports.formCrearCuenta = (req, res) => {
   res.render('crear-cuenta', {
      nombrePagina: 'Crear tu Cuenta'
   })
}

exports.crearNuevaCuenta = async (req, res) => {
   const usuario =  req.body;
   // const {email, nombre, password, repetir} = req.body;

   req.checkBody('confirmar', 'El password confirmado no puede ir vacio').notEmpty();
   req.checkBody('confirmar', 'El Password es diferente').equals(req.body.password);

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


      /* ----------------------------------------------------- */



      /* ----------------------------------------------------- */



      //Flas Message
      // console.log('Usuario Creado', nuevoUsuario);

      req.flash('exito', 'Hemos enviado un email, confirma tu cuenta');
      res.redirect('/iniciar-sesion');

   } catch (error) {
      console.log(error)

      // extraer unicamente el message de lo serores de errores de sequilize
      const erroresSeequelize = error.errors.map( err => err.message);
      // console.log(erroresSeequelize);
     

      // extraer unicamente el msg de lo serores de express      
      const errExp = erroresExpress.map( err => err.msg);
      // console.log(errExp);
   

      //unir las 2 lista de errores
      const listaErrores = [...erroresSeequelize, ...errExp];
      // console.log(listaErrores);


      // mostramos los errores con req.flash
      req.flash('error', listaErrores);
      res.redirect('/crear-cuenta');
   }

}

//Formulario para iniciar sesion
exports.formIniciarSesion = (req, res) => {
   res.render('iniciar-sesion', {
      nombrePagina: 'Inciar Sesión'
   })
}