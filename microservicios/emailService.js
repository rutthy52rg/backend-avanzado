"use strict";
//TODO micro-servicio de envio de correo
const { Responder } = require("cote");
const nodemailer = require("nodemailer");

main().catch((err) => console.log(err));

async function main() {
  //entorno de desarrollo
  const testAccount = await nodemailer.createTestAccount(); //creamos test
  const developConfig = {
    // configuramos test
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  };
  const tranport = nodemailer.createTransport(developConfig);
  const responder = new Responder({ name: "MICRO SERVICIO DE EMAIL" });
  responder.on("send-email", async (req, done) => {
    try {
      const { from, to, subject, html } = req;
      const result = await tranport.sendMail({ from, to, subject, html });
      console.log(
        `URL de previsualización ${nodemailer.getTestMessageUrl(result)}`
      );
      done();
    } catch (err) {
      done({ message: err.message });
    }
  });
}
