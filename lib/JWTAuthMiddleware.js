"use strict";

const jwt = require("jsonwebtoken");

//DONE modulo que exporta un middleware, comprueba en la req si viene token si no es que no está logado le manda a logarse

module.exports = (req, res, next) => {
  //DONE recoge jwttoken de la cabecera o de la query-string o del body
  const jwtToken =
    req.get("Authorization") || req.query.token || req.body.token;

  //DONE comprobamos que me han mandado el token
  if (!jwtToken) {
    const error = new Error("no token provided");
    res.status(401); //DONE contextualizo error => ANUNCIOS SIN TOKEN
    res.json({ error: "Token not provided" }); //DONE respondo json error ANUNCIOS SIN TOKEN
    next(error);
    return; // devuelvo error y ya no sigo
  }
  //DONE comprobar que el toque es valido, con la librería jwt con callback para controlar mejor el error
  //payload es lo que hemos metido en el token en este caso el _id ==> linea 64 de loginController método postJWT
  jwt.verify(jwtToken, process.env.JWT_SECRET, (err, payload) => {
    if (err) {
      const error = new Error("Invalid token"); //creo error
      res.status(401); //DONE contextualizo error => ANUNCIOS CON TOKEN CADUCADO
      res.json({ error: "Invalid token" }); //DONE respondo json error ANUNCIOS SIN TOKEN
      next(error);
      return;
    }
    //DONE  si es valido continuamos pasamos el id en la req para tener al usuario en los siguentes next y poder recuerpar al usuario en cualquier momento (expirado o usuario maliciones lo ha alterado)
    req.apiUserId = payload._id;
    next();
  });
};
