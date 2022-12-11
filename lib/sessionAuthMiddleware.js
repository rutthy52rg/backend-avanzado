"use strict";
//modulo que exporta un middleware, comprueba en la req si viene session si no es que no está logado le manda a logarse

module.exports = (req, res, next) => {
  if (!req.session.userLoged) {
    res.redirect("/login");
    return;
  }
  //si esta logado seguimos
  next();
};
