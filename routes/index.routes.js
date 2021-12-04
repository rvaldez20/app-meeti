
const express = require('express');
const router =  express.Router();

const homeController = require('../controllers/homeController');
const usuariosController = require('../controllers/usuariosController');
const authController = require('../controllers/authController');
const adminController = require('../controllers/adminController');
const gruposController = require('../controllers/gruposController');
const meetiController = require('../controllers/meetiController');



module.exports = function (){
   /* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
                        Cuentas e Inicio de Sesion                     
   ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/
   router.get('/', homeController.home);

   // Crear y confirmar cuentas
   router.get('/crear-cuenta', usuariosController.formCrearCuenta);
   router.post('/crear-cuenta', usuariosController.crearNuevaCuenta);
   router.get('/confirmar-cuenta/:email', usuariosController.confirmarCuenta);

   // Iniciar sesion
   router.get('/iniciar-sesion', usuariosController.formIniciarSesion);
   router.post('/iniciar-sesion', authController.autenticarUsuario);

   /*++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
                                 Panel Administracion                     
   ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/

   // Panel de administracion
   router.get('/administracion',
      [authController.usuarioAutenticado],
      adminController.panelAdministracion
   );

   /*++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
                                 Grupos                     
   ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/
   // formulario para agregar un nuevo grupo
   router.get('/nuevo-grupo', 
      [authController.usuarioAutenticado],
      gruposController.formNuevoGrupo
   );
   router.post('/nuevo-grupo',
      [authController.usuarioAutenticado, gruposController.subirImagen],      
      gruposController.crearGrupo
   );

   // formulario para editar un grupo
   router.get('/editar-grupo/:grupoId',
      authController.usuarioAutenticado,
      gruposController.formEditarGrupo
   );
   router.post('/editar-grupo/:grupoId',
      authController.usuarioAutenticado,
      gruposController.editarGrupo
   );

   // formulario para editar foto del foto del grupo
   router.get('/imagen-grupo/:grupoId',
      authController.usuarioAutenticado,
      gruposController.formEditarImagen
   );
   router.post('/imagen-grupo/:grupoId',
      [authController.usuarioAutenticado, gruposController.subirImagen],
      gruposController.editarImagen
   )

   // formulario para Eliminar grupos
   router.get('/eliminar-grupo/:grupoId',
      authController.usuarioAutenticado,
      gruposController.formEliminarGrupo
   );
   router.post('/eliminar-grupo/:grupoId',
      authController.usuarioAutenticado,
      gruposController.eliminarGrupo
   );


   /*++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
                                 Meetis                     
   ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/
   // formulario para crea un nuevo meeti
   router.get('/nuevo-meeti',
      authController.usuarioAutenticado,
      meetiController.formNuevoMeeti
   );
   

   return router;
}