const Categorias = require('../models/Categorias');
const Grupos = require('../models/Grupos');

const path = require('path');
const fs = require('fs');
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
   }),
   fileFilter(req, file, next) {
      if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
         // formato valido [null pq no hay errro y tre pq se acepta el archvio]
         next(null, true);
      } else {
         // firmato invalidpo [se le pasa un error y false pq se rechaza el archvio]
         next(new Error('Formato no válido'), false);
      }
   }
}

// lo que va en el single es el name de input tipo file
const upload = multer(configuracionMulter).single('imagen');

// para subir la imagen al servidor
exports.subirImagen = (req, res, next) => {
   upload(req, res, function(error) {
      console.log(error);  
      if(error) {               
         if (error instanceof multer.MulterError){
            if(error.code === 'LIMIT_FILE_SIZE') {
               req.flash('error', 'El archivo es muy grande')
            } else {
               req.flash('error', error.message);
            }               
         } else if(error.hasOwnProperty('message')){
            req.flash('error', error.message)
         }
         res.redirect('back');
         return;
      } else {
         next();
      }       
   })
}


// formulario para craer un nuevo grupo
exports.formNuevoGrupo = async(req, res) => {
   // obtenemos todas las categorias
   const categorias = await Categorias.findAll();
   // console.log(categorias);
   
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
   // grupo.categoriaId = req.body.categoriaId; // el selecte tiene name categoriaId

   //leer la imagen (validar si se cargo un archivo)
   if (req.file) {
      grupo.imagen = req.file.filename;
   }

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

// formulario para editar un grupo (solo nombre, descripcion, categoria y url)
exports.formEditarGrupo = async (req, res) => {
   const { grupoId } =  req.params;

   // se optimiza las consultas con multiples await
   // const grupo = await Grupos.findByPk(grupoId);
   // const categorias = await Categorias.findOne();

   // metemos al array consultas las 2 consultas
   const consultas = [];
   consultas.push( Grupos.findByPk(grupoId) );
   consultas.push( Categorias.findAll() );
   // Promise con await para que todas se ejecuten al mismo tiempo (ya que una no depende de otra)
   const [grupo, categorias] = await Promise.all(consultas);

   res.render('editar-grupo', {
      nombrePagina: `Editar Grupo: ${grupo.nombre}`,
      grupo,
      categorias
   })  
}

// para guardar los campos de un grupo (solo nombre, descripcion, categoria y url) en la db
exports.editarGrupo = async(req, res, next) => {
   const { grupoId } =  req.params;

   // -> validar que el grupo que se esta editando existe
   // -> validar que la persona que esta autenticada e sla creadora del grupo
   const grupo = await Grupos.findOne(
      { where: {
         id: grupoId,
         usuarioId:  req.user.id
         } 
      });
      
   // si no existe ese grupo o no es el dueño
   if(!grupo) {
      req.flash('error', 'Operación no valida');
      res.redirect('/administracion');
      return next();
   }

   // si todo bien, leer los valores
   // console.log(req.body)
   const {nombre, descripcion, categoriaId, url} =  req.body;

   // asignar los valores
   grupo.nombre = nombre;
   grupo.descripcion = descripcion;
   grupo.categoriaId = categoriaId;
   grupo.url = url;

   // guardamos en la db
   await grupo.save();
   req.flash('exito', 'Los cambios se guardaron correctamente');
   res.redirect('/administracion');
}

// formulario para cambiar la imagen
exports.formEditarImagen = async(req, res) => {
   const { grupoId } =  req.params;

   const grupo = await Grupos.findOne(
      { where: {
         id: grupoId,
         usuarioId:  req.user.id
         } 
      });
   // console.log(grupo);

   res.render('imagen-grupo',{
      nombrePagina: `Editar Imagen Grupo: ${grupo.nombre}`,
      grupo
   })
}

// modifica l aimagen en la DB y elimina la anterior
exports.editarImagen = async(req, res, next) => {
   const { grupoId } =  req.params;

   const grupo = await Grupos.findOne(
      { where: {
         id: grupoId,
         usuarioId:  req.user.id
         } 
      });

   // si el grupo no es valido
   if(!grupo){
      req.flash('error', 'Operaicón no valida');
      res.redirect('/administracion');
      return next();
   }

   // si grupo y usuario valido
   // verificar que el archivo sea nuevo
   if(req.file) {
      console.log(req.file.filename);
   }

   // ahora revisamos que exista un archvo anterior
   if(grupo.imagen) {
      console.log(grupo.imagen);
   }

   // si hay img anterior y img nueva entonces borramos el archivo de la anterior
   if(req.file && grupo.imagen) {
      // se elimina con fs.unlink
      const imagenAnteriorPath = path.join(__dirname + `/../public/uploads/grupos/${grupo.imagen}`);
      // console.log(imagenAnteriorPath);

      // eliminamos el archivo con fileSystem.unlink
      fs.unlink(imagenAnteriorPath, (error) => {
         if(error) {
            console.log(error)
         }
         return;
      })
   }

   // si hay una imagen nueva, se guarda
   if(req.file) {
      grupo.imagen = req.file.filename;
   }

   // se guarda en la DB
   await grupo.save();
   req.flash('exito', 'Imagen almacenada correctamente');
   res.redirect('/administracion');
}



// Muestra el formulario para eliminar un grupo
exports.formEliminarGrupo = async(req, res, next) => {
   const { grupoId } =  req.params;

   const grupo = await Grupos.findOne({ 
      where: { 
         id: grupoId,
         usuarioId: req.user.id
      } 
   });

   // si no se cumple la validacion
   if(!grupo) {
      req.flash('error', 'Operación no válida');
      res.redirect('/administracion');
      return next();
   }

   // si todo bien ejecutamos la vista
   res.render('eliminar-grupo', {
      nombrePagina: `Eliminar Grupo: ${grupo.nombre}`,
   });
}

// ELimina el grupo y la imagen (si existe)
exports.eliminarGrupo = async(req, res, next) => {
   const { grupoId } =  req.params;

   const grupo = await Grupos.findOne({ 
      where: { 
         id: grupoId,
         usuarioId: req.user.id
      } 
   });

   // si no se cumple la validacion
   if(!grupo) {
      req.flash('error', 'Operación no válida');
      res.redirect('/administracion');
      return next();
   }

   // si la validacion esta correcta
   // console.log(grupo.imagen);

   // si hay una imagen la eliminamos
   if(grupo.imagen) { 
      // Path de la imagen
      const imagenAnteriorPath = path.join(__dirname + `/../public/uploads/grupos/${grupo.imagen}`);
      // console.log(imagenAnteriorPath);

      // eliminamos el archivo con fileSystem.unlink
      fs.unlink(imagenAnteriorPath, (error) => {
         if(error) {
            console.log(error)
         }
         return;
      })
   }

   // Eliminamos el grupo d ela db
   await Grupos.destroy({
      where: {
         id: grupoId
      }
   });
   
   req.flash('exito', 'Grupo Eliminado Correctamente');
   res.redirect('/administracion');
}
