const Usuarios = require('../models/Usuarios');

exports.formCrearCuenta = (req, res) => {
   res.render('crear-cuenta', {
      nombrePagina: 'Crear tu Cuenta'
   })
}

exports.crearNuevaCuenta = async (req, res) => {
   const usuario =  req.body;
   // const {email, nombre, password, repetir} = req.body;


   nuevoUsuario = await Usuarios.create(usuario);

   // TODO: Flas Message
   console.log('Usuario Creado', nuevoUsuario);
}