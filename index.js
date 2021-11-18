const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const path = require('path');
const flash = require('connect-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const expressValidator = require('express-validator');
const routes = require('./routes/index.routes');

//Configuracion DB y odelos
const db = require('./config/db');
   require('./models/Usuarios');
   db.sync().then(() => console.log('DB Connected!')).catch((error) => console.log(error))


// Variables de entorno   
require('dotenv').config({path: 'variables.env'});

// aplicacion
const app =  express();

// habilitamos el parseo
app.use(express.urlencoded({extended: true}));
app.use(express.json());


// validacion de express validator
app.use(expressValidator());


// habilitar EJS como templateEngie
app.use(expressLayouts)
app.set('view engine', 'ejs');


//Ubicación vistas
app.set('views', path.join(__dirname, './views'));


// Archivos estaticos
app.use(express.static('public'));


// Habilitamos cookie parser
app.use(cookieParser());


// crear la sesion
app.use(session({
   secret: process.env.SECRET,
   key: process.env.KEY,
   resave: false,
   saveUninitialized: false
}))


// Agrega  Flsh Message
app.use(flash());


//Middlewares
app.use((req, res, next) => {
   res.locals.mensajes = req.flash();
   const fecha = new Date();
   res.locals.year = fecha.getFullYear();
   next();
});


//Routing
app.use('/', routes())


// Agrega el puerto
app.listen(process.env.PORT, () => {
   console.log(`Server run on PORT ${process.env.PORT}`)
})