const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const path = require('path');
require('dotenv').config({path: 'variables.env'});

const routes = require('./routes/index.routes');
const app =  express();

// habilitar EJS como templateEngie
app.use(expressLayouts)
app.set('view engine', 'ejs');


//Ubicación vistas
app.set('views', path.join(__dirname, './views'));


// Archivos estaticos
app.use(express.static('public'));


//Routing
app.use('/', routes())


// Agrega el puerto
app.listen(process.env.PORT, () => {
   console.log(`Server run on PORT ${process.env.PORT}`)
})