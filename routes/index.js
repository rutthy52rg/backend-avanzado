"use strict";

const router = require("express").Router();
const fsPromises = require("fs").promises;
const path = require("path");
const asyncHandler = require("express-async-handler");
const { __ } = require("i18n");
const { User } = require("../models");

/* GET home page. */
router.get(
  "/",
  asyncHandler(async function (req, res, next) {
    try {
      const filename = path.join(__dirname, "../README.md");
      const readme = await fsPromises.readFile(filename, "utf8");
      const userId = req.session.userLoged;
      const user = await User.findById(userId);
      res.locals.title = req.__("Practice Backend Advanced");
      res.locals.email = user ? user.email : "";
      res.render("index", { readme });
    } catch (err) {
      next(err);
    }
  })
);

module.exports = router;
