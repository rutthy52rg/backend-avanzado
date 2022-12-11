"user strict";

const multer = require("multer");
const path = require("path");

//TODO configuración de upload única. guardamos en memoria
const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    const ruta = path.join(__dirname, "../public/images/", "uploads");
    callback(null, ruta); //prmier parametro es si ha habido error, segundo param => donde lo quiero guardar
  },
  //nombre del fichero
  filename: function (req, file, callback) {
    const filename =
      file.fieldname + "-" + Date.now() + "-" + file.originalname;
    callback(null, filename); //prmier parametro es si ha habido error, segundo param => nombre del fichero
  },
});

module.exports = multer({ storage }); //creo middleware que es una instancia de multer para ir con sus métodos
