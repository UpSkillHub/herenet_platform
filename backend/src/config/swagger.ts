import swaggerJsdoc from 'swagger-jsdoc';

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'HereNet API Documentation',
      version: '1.0.0',
      description: 'Online Marketplace & Opportunity Platform API',
    },
    servers: [{ url: 'http://localhost:5000' }],
  },
  apis: ['./src/routes/*.ts'],   // Make sure this path is correct
};

export const swaggerSpecs = swaggerJsdoc(swaggerOptions);