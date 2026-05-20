import swaggerJsdoc from 'swagger-jsdoc';

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'HereNet API Documentation',
      version: '1.0.0',
      description: 'Online Marketplace & Opportunity Platform API',
    },
    servers: [{ url: 'http://localhost:5001' }],
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
  apis: ['./src/routes/*.{js,ts}'],   // Scan both TS and JS route files
};

export const swaggerSpecs = swaggerJsdoc(swaggerOptions);