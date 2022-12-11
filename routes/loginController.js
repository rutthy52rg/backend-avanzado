"use strict";
//cargamos jwt de la libreía instalada
const jwt = require("jsonwebtoken");
//importamos el modelo usuario para poder usarlo
const { User } = require("../models");

//mejor para poder luego hacer test unitarios
//se importará en app.js

class LoginController {
  index(req, res, next) {
    res.locals.error = "";
    res.locals.email = "";
    res.render("login");
  }

  /* ============  LOGIN POST DESDE EL WEBSITE =============== */

  async post(req, res, next) {
    try {
      const { email, password } = req.body;

      // buscar usuario en la bbdd
      const user = await User.findOne({ email });

      // si no lo encuentro le saco un error
      if (!user || !(await user.comparePassword(password))) {
        res.locals.error = res.__("Invalid credentials");
        res.locals.email = email;
        res.render("login");
        return;
      }

      // si existe y la contraseña coincide
      // => añado en la sesión del usuario,  que es un usuario logado  y le asigno su id, el middleware creará una cookie con el identificador de la sessión

      req.session.userLoged = user._id;

      //DONE enviamos email al usuario cuando hace login (ver => models users y lib/emailTransportConfigure)
      user.sendEmail("Bienvenido", "Bienvenido a NodeAPP");

      // => le llevamos a la página privada
      res.redirect("/anuncios");
    } catch (err) {
      next(err);
    }
  }
  /* ============   LOGIN POST AL API  =============== */
  async postJWT(req, res, next) {
    try {
      const { email, password } = req.body;

      // buscar usuario en la bbdd
      const user = await User.findOne({ email });

      // si no lo encuentro le saco un error, se devuelve un Json
      if (!user || !(await user.comparePassword(password))) {
        res.status(401);
        res.json({ error: "Invalid credentials" });
        return;
      }
      // si existe y la contraseña coincide

      // => se genera un token JWT con su _id, sólo se añade lo que se necesita
      // sign => firma
      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
        // contraseña en variable de entorno en fichero .env
        expiresIn: "2d", //importante pq si no sería válido por siempre
      });
      // => le respondemos un json dando el token que hemos generado
      res.json({ token }); // es lo mismo que poner {token:token}
    } catch (err) {
      next(err);
    }
  }

  logout(req, res, next) {
    req.session.regenerate((err) => {
      // si hay err
      if (err) {
        next(err);
        return;
      }
      //si no hay err dirigimos a home
      res.redirect("/");
    });
  }
}
module.exports = LoginController;
