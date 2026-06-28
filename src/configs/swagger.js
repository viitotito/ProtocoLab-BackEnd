import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API ProtocoLab',
      version: '1.0.0',
      description: 'Documentação ProtocoLab',
    },

    servers: [
      {
        url: 'http://localhost:3000',
      },
    ],

    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },

  apis: ["./src/docs/**/*.yaml"],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;