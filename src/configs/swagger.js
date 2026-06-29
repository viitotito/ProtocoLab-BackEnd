import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API ProtocoLab",
      version: "1.0.0",
      description: "ProtocoLab Documentation",
    },

    servers: [
      {
        url: "http://localhost:3000",
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

      parameters: {
        AcceptLanguage: {
          name: "Accept-Language",
          in: "header",
          required: false,
          schema: {
            type: "string",
            example: "en-US",
          },
          description: "Result language (pt-BR, en-US, es-ES)",
        },
      },
    },

    security: [
      {
        bearerAuth: [],
      },
    ],
  },

  apis: ["./src/docs/**/*.yaml"],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;