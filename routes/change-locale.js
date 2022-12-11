var express = require("express");
var router = express.Router();

/* GET features page. */
router.get("/:locale", function (req, res, next) {
  var locale = req.params.locale; //recogemos el local desde el parametro url -- enlace en cabecera
  try {
    //ponemos cookie en la respuesta que indique el nuevo locale. La cookie la lee i18n.init() de app.js
    res.cookie("cookie-locale", locale, {
      //duración
      maxAge: 1000 * 60 * 60 * 24 * 30, //1 mes
    }); //hay que añadir esta cookie en la configuración de i18n

    //hacer redirección a la misma página de donde venía la petición
    res.redirect(req.get("Referer")); //referer se llama así la cabecera http (con get)
  } catch (err) {
    next(err);
  }
});

module.exports = router;
