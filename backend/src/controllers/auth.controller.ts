import { Request, Response } from 'express';
import authService from '../services/auth.services';

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const result = await authService.login({ email, password });
    return res.json(result);
  } catch (error: any) {
    console.error('💥 Login controller error:');
    console.error('Message:', error.message);
    console.error('Stack:', error.stack);
    console.error('Full error:', JSON.stringify(error, null, 2));
    
    const message = error.message || 'Login failed';
    if (message.includes('Invalid email or password')) {
      return res.status(401).json({ message });
    }
    if (message.includes('pending admin approval')) {
      return res.status(403).json({ message });
    }
    return res.status(500).json({ message });
  }
};

// Keep register for future use
export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, phone, role} = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    const result = await authService.register({ name, email, password, phone,role });
    return res.status(201).json(result);
  } catch (error: any) {
    console.error('💥 Register controller error:');
    console.error('Message:', error.message);
    console.error('Stack:', error.stack);
    console.error('Full error:', JSON.stringify(error, null, 2));
    
    if (error.message?.includes('already exists')) {
      return res.status(409).json({ message: error.message });
    }
    return res.status(500).json({ message: error.message || 'Registration failed' });
  }
};

export const verifyOtp = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP are required' });
    }

    const result = await authService.verifyOtp(email, otp);
    return res.json(result);
  } catch (error: any) {
    console.error('💥 Verify OTP controller error:');
    console.error('Message:', error.message);
    console.error('Stack:', error.stack);
    console.error('Full error:', JSON.stringify(error, null, 2));
    
    return res.status(400).json({ message: error.message || 'OTP verification failed' });
  }
};

export const resendOtp = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const result = await authService.resendOtp(email);
    return res.json(result);
  } catch (error: any) {
    console.error('💥 Resend OTP controller error:');
    console.error('Message:', error.message);
    console.error('Stack:', error.stack);
    console.error('Full error:', JSON.stringify(error, null, 2));
    
    return res.status(400).json({ message: error.message || 'Failed to resend OTP' });
  }
};

export const requestPasswordReset = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const result = await authService.requestPasswordReset(email);
    return res.json(result);
  } catch (error: any) {
    console.error('💥 Request password reset error:');
    console.error('Message:', error.message);
    console.error('Stack:', error.stack);
    console.error('Full error:', JSON.stringify(error, null, 2));
    
    return res.status(400).json({ message: error.message || 'Failed to send password reset OTP' });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ message: 'Email, OTP, and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    const result = await authService.resetPassword(email, otp, newPassword);
    return res.json(result);
  } catch (error: any) {
    console.error('💥 Reset password error:');
    console.error('Message:', error.message);
    console.error('Stack:', error.stack);
    console.error('Full error:', JSON.stringify(error, null, 2));
    
    return res.status(400).json({ message: error.message || 'Failed to reset password' });
  }
};