"use strict";

const express = require("express");
const createError = require("http-errors");
const path = require("path");
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const session = require("express-session");
const MongoStore = require("connect-mongo");

/* ========== libs ============== */

var i18n = require("./lib/i18nConfigure");
const sessionAuth = require("./lib/sessionAuthMiddleware");
const jwtAuthMiddleware = require("./lib/JWTAuthMiddleware");

/* ========== routes  ============== */
//importamos login llamando a la clase
const LoginController = require("./routes/loginController");

/* ========== instancias controladores  ============== */
const loginController = new LoginController(); // WEBSITE
const loginControllerAPI = new LoginController(); // API

const { isAPI } = require("./lib/utils");
require("./models"); // Connect DB & register models

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "html"); // usa motor de vista custom llamado html
app.engine("html", require("ejs").__express); // ese motor usa ejs y ahora renombramos las views a html

/**
 * Global Template variables
 */

/**
 * Middlewares
 * Cada petición será evaluada por ellos
 */
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

/* ========== multidiomas ============== */
//setup de i18n
app.use(i18n.init); //lee cabeceras a que idioma está y ya sabe que idioma poner y guarda cookies en change-locales. Para que lea correctamente las cookies tendrá que estar despues de cookieParser

app.locals.title = "Practice Backend Advanced";
/**
 * API v1 routes
 */

app.use(
  "/apiv1/anuncios",
  jwtAuthMiddleware,
  require("./routes/apiv1/anuncios")
);
//DONE api para hacer login y devolver un token JWT
app.use("/apiv1/authenticate", loginControllerAPI.postJWT);

// middleware cookies session => control acceso a la WEB por usuario y contraseña con COOKIES
app.use(
  session({
    name: "mi-practica-backend-avanzado-session",
    secret: ".OmbY'yR5e$^N-$mHRx",
    saveUninitialized: true,
    resave: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 2, //2 días de inactividad de usuario expira
    },
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_CONNECTION_STRING, //guardarmos en el store de mongoconnect en mongodb en lugar de memoria de servidor para no perder sesion cada vez que recarga la aplicación
    }),
  })
);

// middleware al que acceden todas las vistas, cojo de req la session y lo guardo en res.locals.session para mostrar nombre de usuario en este caso
app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});
/**
 * Website routes
 */
app.use("/", require("./routes/index"));
app.use("/about-us", require("./routes/about-us"));
//DONE acceso a anuncios como zona privada con autorización mediante sesion usuario-contraseña
app.use("/anuncios", sessionAuth, require("./routes/anuncios"));
app.use("/change-locale", require("./routes/change-locale"));
//DONE gestion de sesion en login con métodos, index, post y logout
//con classes para facilitar testing
app.get("/login", loginController.index);
app.post("/login", loginController.post);
app.get("/logout", loginController.logout);

/**
 * Error handlers
 */
// catch 404 and forward to error handler
app.use((req, res, next) => next(createError(404)));

// error handler
app.use((err, req, res, next) => {
  // eslint-disable-line no-unused-vars
  if (err.array) {
    // validation error
    err.status = 422;
    const errInfo = err.array({ onlyFirstError: true })[0];
    err.message = isAPI(req)
      ? { message: "not valid", errors: err.mapped() }
      : `not valid - ${errInfo.param} ${errInfo.msg}`;
  }

  // establezco el status a la respuesta
  err.status = err.status || 500;
  res.status(err.status);

  // si es un 500 lo pinto en el log
  if (err.status && err.status >= 500) console.error(err);

  // si es una petición al API respondo JSON:

  if (isAPI(req)) {
    res.json({ error: err.message });
    return;
  }

  // ...y si no respondo con HTML:

  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  res.render("error");
});

module.exports = app;
