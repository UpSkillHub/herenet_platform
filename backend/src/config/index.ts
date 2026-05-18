import dotenv from 'dotenv';
dotenv.config();

export const config = {
  jwtSecret: process.env.JWT_SECRET!,
  port: process.env.PORT || 5000,
  emailUser: process.env.EMAIL_USER,
  emailPass: process.env.EMAIL_PASS,
};