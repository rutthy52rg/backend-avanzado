const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
// const emailTransport = require("../lib/emailTransportConfigure");
// const nodemailer = require("nodemailer");
const { Requester } = require("cote");
const requester = new Requester({ name: "nodepop-app" });
//crear schema
const userSchema = mongoose.Schema({
  email: { type: String, unique: true }, //único, crea índice automaticamente, el índice unique importante para la no ralentización
  password: String,
  /*ejem. indice con password. Buscamos un password y le ponemos un índice => 
    password: { type: String, index: true }
  */
});

// metodo statico
userSchema.statics.hashPassword = function (passwordEnClaro) {
  return bcrypt.hash(passwordEnClaro, 7);
};

// metodo de instancia
userSchema.methods.comparePassword = function (passwordEnClaro) {
  return bcrypt.compare(passwordEnClaro, this.password);
};

//metodo para envio de emails ==> see lib/emailTransportConfigure
//enviaremos un email al usuario cada vez que se hace login (loginController)

userSchema.methods.sendEmail = async function (subject, body) {
  const evento = {
    type: "send-email",

    from: process.env.EMAIL_SERVICE_FROM,
    to: this.email,
    subject: subject,
    html: body,
  };
  return new Promise((resolve) => requester.send(evento, resolve));
};
//crear modelo
// creamos el modelo
const User = mongoose.model("User", userSchema);

//exportar modelo
module.exports = User;
