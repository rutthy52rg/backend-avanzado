"use strict";
const { Responder } = require("cote");
const jimp = require("jimp");

main().catch((err) => console.log(err));

async function main() {
  const responder = new Responder({ name: "MICRO SERVICIO DE THUMBNAILS" });
  responder.on("create-thumbnail", async (req, done) => {
    try {
      const { urlOrigin, urlResult } = req;

      // Read the image.
      const urlImage = await jimp.read(urlOrigin);

      // Resize the image to width 150 and auto height.
      await urlImage.resize(100, jimp.AUTO);

      // Save and overwrite the image
      await urlImage.writeAsync(urlResult);
      
      console.log(`URL de previsualización del thumbnail ${urlResult}`);
      done();
    } catch (err) {
      done({ message: err.message });
    }
  });
}
