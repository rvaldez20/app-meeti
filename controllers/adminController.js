const Grupos = require('../models/Grupos');


exports.panelAdministracion = async(req, res) => {

   const grupos = await Grupos.findAll({where: {usuarioId: req.user.id}});
   // console.log(grupos);

   res.render('administracion', {
      nombrePagina: 'Panel de Administración',
      grupos
   })
}