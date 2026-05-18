// backend/src/services/auth.service.ts
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../config/database';
import otpUtils from '../utils/otp';
import { RegisterInput, LoginInput } from '../types/auth.types';

export const authService = {
  async register(data: RegisterInput) {
    const { name, email, password, phone } = data;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phone: phone || null,
        status: 'pending',
        isAdmin: false,
      },
    });

    // Generate & Store OTP
    const otp = otpUtils.generateOtp();
    otpUtils.storeOtp(email, otp);

    return {
      userId: user.id,
      message: 'Registration successful. Check terminal for OTP.',
    };
  },

  async login(data: LoginInput) {
    const { email, password } = data;

    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
        status: true,
        isAdmin: true,
      },
    });

    if (!user) throw new Error('Invalid email or password');

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) throw new Error('Invalid email or password');

    if (user.status !== 'approved') {
      throw new Error('Your account is pending admin approval');
    }

    const token = jwt.sign(
      { userId: user.id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      },
    };
  },

  async verifyOtp(email: string, otp: string) {
    const result = otpUtils.verifyOtp(email, otp);
    if (!result.success) {
      throw new Error(result.message);
    }

    await prisma.user.update({
      where: { email },
      data: { status: 'approved' },
    });

    return { message: 'Account approved successfully. You can now login.' };
  },
};

export default authService;