
import swaggerJsdoc from 'swagger-jsdoc';

const swaggerOptions: swaggerJsdoc.Options = {
  swaggerDefinition: {
    openapi: '3.0.0',
    servers: [
      {
        url: '/api',
      },
    ],
    schemes: ['http', 'https'],
    info: {
      title: 'API documentation',
      version: '1.0.0',
      description: 'Api documentation for web server',
    },
    consumes: ['application/json'],
    produces: ['application/json'],
  },
  apis: ['src/main/routes/*.ts', 'src/main/schemas/*.ts', 'src/main/schemas/*/*.ts'],
};



export const swaggerDocs = swaggerJsdoc(swaggerOptions);