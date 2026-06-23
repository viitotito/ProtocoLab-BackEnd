import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API protocolab',
      version: '1.0.0',
      description: 'Protocolab Documentation',
    },
    servers: [
      {
        url: 'http://localhost:3000',
      },
    ],
  },

  apis: ['./src/**/*.js', './**/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;