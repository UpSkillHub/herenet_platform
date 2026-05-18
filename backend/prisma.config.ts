// prisma.config.ts
import "dotenv/config";
declare const process: any;

export default {
  schema: "./prisma/schema.prisma",
  
  datasource: {
    url: process.env.DATABASE_URL,
  },

  // Optional but recommended
  generator: {
    output: "../node_modules/.prisma/client", // or leave default
  },

  migrations: {
    path: "./prisma/migrations",
  },
};;