// backend/src/utils/auth.utils.ts
import jwt from 'jsonwebtoken';

export const generateToken = (userId: string, isAdmin: boolean) => {
  return jwt.sign(
    { userId, isAdmin },
    process.env.JWT_SECRET!,
    { expiresIn: '7d' }
  );
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, process.env.JWT_SECRET!);
};