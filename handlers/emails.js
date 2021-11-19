const nodemailer = require('nodemailer');
const emailConfig = require('../config/emails');
const fs = require('fs');
const path = require('path');
const util = require('util');
const ejs = require('ejs');

let transport = nodemailer.createTransport({
   host: emailConfig.host,
   port: emailConfig.port,
   auth: {
      user: emailConfig.user,
      pass: emailConfig.pass
   }
});

exports.enviarEmail = async(opciones) => {
   // console.log(opciones);

   // leer el archivo para el email
   // const archivo = __dirname + `/../views/emails/${opciones.archivo}.ejs`;
   const archivo = path.join(__dirname + `/../views/emails/${opciones.archivo}.ejs`);
   // console.log(__dirname);
   // console.log(archivo);


   // compilarlo
   const compilado = ejs.compile(fs.readFileSync(archivo, 'utf8'));


   // crear el HTML
   const html = compilado({ url: opciones.url});


   // configurar opciones email
   const opcionesEmail = {
      from: 'Meeti<noreplay@meeti.com>',
      to: opciones.usuario.email,
      subject: opciones.subject,
      html: html
   }


   // envviar el email
   const sendMail = util.promisify(transport.sendMail, transport);
   return sendMail.call(transport, opcionesEmail);

}