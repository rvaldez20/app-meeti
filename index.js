const express = require('express');
require('dotenv').config({path: 'variables.env'});

const routes = require('./routes/index.routes');
const app =  express();

//Routing
app.use('/', routes())


// Agrega el puerto
app.listen(process.env.PORT, () => {
   console.log(`Server run on PORT ${process.env.PORT}`)
})