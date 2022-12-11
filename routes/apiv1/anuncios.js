"use strict";

const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

const Anuncio = mongoose.model("Anuncio");
const { buildAnuncioFilterFromReq } = require("../../lib/utils");
const upload = require("../../lib/uploadConfig");
// const fs = require("fs");
const { Requester } = require("cote");
const requester = new Requester({ name: "practica-backend-avanzado" });
const path = require("path");
// Return the list of anuncio
router.get("/", (req, res, next) => {
  const start = parseInt(req.query.start) || 0;
  const limit = parseInt(req.query.limit) || 1000; // nuestro api devuelve max 1000 registros
  const sort = req.query.sort || "_id";
  const includeTotal = req.query.includeTotal === "true";

  const filters = buildAnuncioFilterFromReq(req);

  // Ejemplo hecho con callback, aunque puede hacerse mejor con promesa y await
  Anuncio.list(
    filters,
    start,
    limit,
    sort,
    includeTotal,
    function (err, anuncios) {
      if (err) return next(err);
      res.json({ result: anuncios });
    }
  );
});

// Return the list of available tags
router.get(
  "/tags",
  asyncHandler(async function (req, res) {
    const distinctTags = await Anuncio.distinct("tags");
    res.json({ result: distinctTags });
  })
);

// Create
router.post(
  "/",
  upload.single("foto"),
  [
    // validaciones:
    body("nombre").isAlphanumeric().withMessage("nombre must be string"),
    body("venta").isBoolean().withMessage("must be boolean"),
    body("precio").isNumeric().withMessage("must be numeric"),
  ],
  asyncHandler(async (req, res) => {
    validationResult(req).throw();
    const anuncioData = req.body;
    anuncioData.foto = req.file.filename;

    const anuncio = new Anuncio(anuncioData);
    console.log(anuncio);
    const anuncioGuardado = await anuncio.save();

    res.json({ result: anuncioGuardado });
  })
);

// Actualizar un anuncio
// PUT => localhost:3001/api/announcements/_id
router.put("/:id", upload.single("foto"), async (req, res, next) => {
  try {
    const _id = req.params.id;
    const data = req.body;
    data.foto = req.file.filename;
    const anuncioActualizado = await Anuncio.findOneAndUpdate(
      { _id: _id },
      data,
      {
        new: true, // esto hace que nos devuelva el documento actualizado
      }
    );
    console.log("datafoto", data.foto);
    res.json({ result: anuncioActualizado });
    createThumbnail(data.foto);
  } catch (error) {
    res.json({ error: error });
    next(error);
  }
});

// DELETE /api/announcement/:_id
// Eliminar un anuncio
router.delete("/:id", async (req, res, next) => {
  try {
    const _id = req.params.id;
    const anuncio = await Anuncio.findOne({ _id: _id });
    // const path = `./public/images/uploads/${anuncio.foto}`;
    // console.log("res", path);
    // await Anuncio.deleteOne({ _id: _id });
    // await fs.unlinkSync(path);
    res.json({ borrado: `anuncio borrado ${_id}` });
  } catch (error) {
    next(error);
  }
});

const createThumbnail = async function (image) {
  const urlOrigin = path.join(__dirname, "../../public/images/uploads/", image);
  const urlResult = path.join(
    __dirname,
    "../../public/images/uploads/100/",
    image
  );
  const evento = {
    type: "create-thumbnail",

    urlOrigin: urlOrigin,
    urlResult: urlResult,
  };
  return new Promise((resolve) => requester.send(evento, resolve));
};
module.exports = router;
