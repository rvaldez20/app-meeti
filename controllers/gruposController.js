const Categorias = require('../models/Categorias');
const Grupos = require('../models/Grupos');

const path = require('path');
const multer = require('multer');
const shortid = require('shortid');

// 100,000 = 100 kb

const configuracionMulter = {
   limits: { fileSize: 100000 },   
   storage: fileStorage = multer.diskStorage({
      destination: (req, file, next) => {
         next(null,path.join(__dirname + '/../public/uploads/grupos'))
      },
      filename: (req, file, next) => {
         const extension = file.mimetype.split('/')[1];
         next(null, `${shortid.generate()}.${extension}`)
      }
   })
}

// lo que va en el single es el name de input tipo file
const upload = multer(configuracionMulter).single('imagen');

// para subir la imagen al servidor
exports.subirImagen = (req, res, next) => {
   upload(req, res, function(error) {
      if(error) {
         console.log(error);
         if(error) {
            if (error instanceof multer.MulterError){
               if(error.code === 'LIMIT_FILE_SIZE') {
                  req.flash('error', 'El archivo es muy grande')
               } else {
                  req.flash('error', error.message);
               }
               res.redirect('back');
               return;
            } else {
               next();
            }
         }
      } else {
         next();
      }
   })

}

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
   // sanitizar campos
   req.sanitizeBody('nombre');
   req.sanitizeBody('url');
   
   const grupo = req.body;
   // console.log(grupo);

   // se agregan los comapos con los que se hace la relacion
   grupo.usuarioId = req.user.id;
   grupo.categoriaId = req.body.categoria;

   //leer la imagen
   grupo.imagen = req.file.filename;


   try {
      // almacenamos los datos del grupo en la db
      await Grupos.create(grupo);
      req.flash('exito', 'El grupo se ha creado correctamente');
      res.redirect('/administracion');
      
   } catch (error) {            
      // extraer unicamente el message de lo serores de errores de sequilize
      const erroresSeequelize = error.errors.map( err => err.message);

      req.flash('error', erroresSeequelize);
      res.redirect('/nuevo-grupo');
   }

}


