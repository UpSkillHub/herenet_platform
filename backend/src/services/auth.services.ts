// backend/src/services/auth.service.ts
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../config/database';
import otpUtils from '../utils/otp';
import emailService from './email.service';
import { RegisterInput, LoginInput } from '../types/auth.types';

async function generateAndSendOtp(email: string) {
  const otp = otpUtils.generateOtp();
  otpUtils.storeOtp(email, otp);
  await emailService.sendOtp(email, otp);
}

export const authService = {
  async register(data: RegisterInput) {
    const { name, email, password, phone, role } = data;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    if (role && role === 'member') {
      const existingMember = await prisma.user.findFirst({
        where: { email, isMember: true },
      });
      if (existingMember) {
        throw new Error('Member with this email already exists');
      }
    }
    else if (role && role === 'admin') {
      const existingAdmin = await prisma.user.findFirst({
        where: { email, isAdmin: true },
      });
      if (existingAdmin) {
        throw new Error('Admin with this email already exists');
      }
    }
    
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: await bcrypt.hash(password, 10),
        phone,
        status: 'pending',
        isMember: role === 'member',
        isAdmin: role === 'admin',
      },
    });

  

    // Generate & Store OTP
    const otp = otpUtils.generateOtp();
    otpUtils.storeOtp(email, otp);

    await emailService.sendOtp(email, otp);

    return {
      userId: user.id,
      message: 'Registration successful. Check your email for the OTP.',
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
        isMember: true,
      },
    });

    if (!user) throw new Error('Invalid email or password');

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) throw new Error('Invalid email or password');

    if (user.status !== 'approved') {
      if (user.status === 'pending') {
        await generateAndSendOtp(email);
        throw new Error('Your account is pending approval. A new OTP has been sent to your email.');
      }
      throw new Error('Your account is pending admin approval');
    }

    const token = jwt.sign(
      { userId: user.id, isAdmin: user.isAdmin, isMember: user.isMember },
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
        isMember: user.isMember,
      },
    };
  },

  async verifyOtp(email: string, otp: string) {
    const result = otpUtils.verifyOtp(email, otp);
    if (!result.success) {
      throw new Error(result.message);
    }

    const user = await prisma.user.update({
      where: { email },
      data: { status: 'approved' },
      select: {
        id: true,
        name: true,
        email: true,
        isAdmin: true,
        isMember: true,
        status: true,
      },
    });

    const token = jwt.sign(
      { userId: user.id, isAdmin: user.isAdmin, isMember: user.isMember },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    return {
      message: 'Account approved successfully. You can now login.',
      token,
      user,
    };
  },

  async resendOtp(email: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new Error('No user found with this email');
    }
    if (user.status === 'approved') {
      throw new Error('This account is already verified');
    }

    const otp = otpUtils.generateOtp();
    otpUtils.storeOtp(email, otp);

    await emailService.sendOtp(email, otp);

    return {
      message: 'A new OTP has been sent to your email.',
    };
  },

  async requestPasswordReset(email: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new Error('No user found with this email');
    }

    // Generate and store OTP for password reset
    const otp = otpUtils.generateOtp();
    otpUtils.storeOtp(`reset_${email}`, otp);

    await emailService.sendPasswordResetOtp(email, otp);

    return {
      message: 'Password reset OTP has been sent to your email.',
    };
  },

  async resetPassword(email: string, otp: string, newPassword: string) {
    // Verify OTP with 'reset_' prefix
    const result = otpUtils.verifyOtp(`reset_${email}`, otp);
    if (!result.success) {
      throw new Error(result.message);
    }

    // Verify user exists
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new Error('No user found with this email');
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await prisma.user.update({
      where: { email },
      data: { password: hashedPassword },
    });

    return {
      message: 'Password reset successfully. You can now login with your new password.',
    };
  },
};

export default authService;