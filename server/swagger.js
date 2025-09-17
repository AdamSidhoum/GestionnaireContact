const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Contacts & Auth",
      version: "1.0.0",
      description: "API pour gérer utilisateurs et contacts",
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
      {
        url: "https://gestionnairecontact-2.onrender.com",
        description: "Serveur en ligne (Render)",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        User: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: {
              type: "string",
            },
            password: {
              type: "string",
            },
          },
        },
        Contact: {
          type: "object",
          required: ["name", "lastname", "imageUrl", "num"],
          properties: {
            name: {
              type: "string",
            },
            lastname: {
              type: "string",
            },
            num: {
              type: "string",
            },
            imageUrl: {
              type: "string",
            },
          },
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ["./routes/*.js"],
};

const specs = swaggerJsDoc(options);

function setupSwagger(app) {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
}

module.exports = setupSwagger;
