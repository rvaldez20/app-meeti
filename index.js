const express = require('express');
require('dotenv').config({path: 'variables.env'});


const app =  express();



app.listen(process.env.PORT, () => {
   console.log(`Server run on PORT ${process.env.PORT}`)
})