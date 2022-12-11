"usr strict";

const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUI = require("swagger-ui-express");

const options = {
  swaggerDefinition: {
    info: {
      title: "Nodepop API",
      version: "0.1",
      description: "API de announcements",
    },
  },
  apis: ["swagger.yaml"],
};

const especificacion = swaggerJSDoc(options);

module.exports = [swaggerUI.serve, swaggerUI.setup(especificacion)]; //pasamos el middleware y el setup
