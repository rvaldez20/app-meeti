const Grupos = require('../models/Grupos');


// Formulario para crear un meeti
exports.formNuevoMeeti = async(req, res) => {
   const grupos = await Grupos.findAll({where: { usuarioId: req.user.id }});

   res.render('meetis/nuevo-meeti', {
      nombrePagina: 'Crear Nuevo Meeti',
      grupos
   });
}