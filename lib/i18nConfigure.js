"use strict";

const i18n = require("i18n");
const path = require("path");
i18n.configure({
  locales: ["en", "es"],
  directory: path.join(__dirname, "..", "locales"), //indicamos directorio
  defaultLocale: "en", //indicamos idioma por defecto, si no encuentra localización muestra este
  autoReload: true, //recarga fichero cuando encuentra una nueva cadena como modo watch
  syncFiles: true, // sincroniza todos los ficheros de idiomas al detectar una nueva cadena
  cookie: "cookie-locale", // nombre de la cookie que hemos guardado
});
//para usar en scripts
i18n.setLocale("en");
//para dejarlo disponible para importación
module.exports = i18n;
