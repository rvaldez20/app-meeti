const Categorias = require('../models/Categorias');
const Grupos = require('../models/Grupos');

// formulario para craer un nuevo grupo
exports.formNuevoGrupo = async(req, res) => {
   // obtenemos todas las categorias
   const categorias = await Categorias.findAll();
   
   res.render('nuevo-grupo', {
      nombrePagina: 'Crea un nuevo Grupo',
      categorias
   })
}

// se envian los datos del formulario para almacenarlos en la db
exports.crearGrupo = async (req, res) => {
   const grupo = req.body;
   // console.log(grupo);

   grupo.usuarioId = req.user.id;
   grupo.categoriaId = req.body.categoria;

   try {
      // almacenamos los datos del grupo en la db
      await Grupos.create(grupo);
      req.flash('exito', 'El grupo se ha creado correctamente');
      res.redirect('/administracion');
      
   } catch (error) {
      console.log(error);
      req.flash('error', error);
      res.redirect('/nuevo-grupo');
   }

}
