"use strict";
var express = require("express");
var router = express.Router();
const { User } = require("../models");

/* GET features page. */
router.get("/", async function (req, res, next) {
  try {
    const userId = req.session.userLoged;
    const user = await User.findById(userId);
    res.locals.email = user ? user.email : "";
    res.render("about-us", {});
  } catch (err) {
    next(err);
  }
});

module.exports = router;
