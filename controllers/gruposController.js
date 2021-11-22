const Categorias = require('../models/Categorias');

exports.formNuevoGrupo = async(req, res) => {
   // obtenemos todas las categorias
   const categorias = await Categorias.findAll();
   
   res.render('nuevo-grupo', {
      nombrePagina: 'Crea un nuevo Grupo',
      categorias
   })
}