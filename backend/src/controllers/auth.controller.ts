import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma';

export const login = async (req: Request, res: Response) => {
  try {
    console.log('📥 Login request body:', req.body);

    const { email, password } = req.body;

    if (!email || !password) {
      console.log('❌ Missing email or password');
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
        isAdmin: true,
        status: true,
      }
    });

    console.log('👤 User found:', user ? 'Yes' : 'No');

    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isValid = await bcrypt.compare(password, user.password);
    console.log('🔑 Password match:', isValid);

    if (!isValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    if (user.status !== 'approved') {
      return res.status(403).json({ message: 'Your account is pending approval' });
    }

    const token = jwt.sign(
      { userId: user.id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    console.log('✅ Login successful for:', email);

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      }
    });
  } catch (error: any) {
    console.error('💥 Login controller error:', error);
    res.status(500).json({ 
      message: 'Login failed', 
      error: error.message 
    });
  }
};

// Keep register for future use
export const register = async (req: Request, res: Response) => {
  res.status(501).json({ message: 'Register not implemented yet' });
};

export const verifyOtp = async (req: Request, res: Response) => {
  res.status(501).json({ message: 'OTP verification not implemented yet' });
};