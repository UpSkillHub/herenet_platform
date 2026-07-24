// backend/src/services/email.service.ts
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: Number(process.env.EMAIL_PORT || 587),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const emailService = {
  async sendOtp(email: string, otp: string) {
    const mailOptions = {
      from: `"HereNet" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Your HereNet Verification OTP',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Welcome to HereNet!</h2>
          <p>Your verification code is:</p>
          <h1 style="color: #C9A84C; letter-spacing: 8px;">${otp}</h1>
          <p>This code will expire in 10 minutes.</p>
          <p>If you didn't request this, please ignore this email.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`📧 Email OTP sent to ${email}`);
  },

  async sendWelcomeEmail(email: string, name: string) {
    await transporter.sendMail({
      from: `"HereNet" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Welcome to HereNet, ${name}!`,
      html: `
        <h2>Welcome aboard, ${name}!</h2>
        <p>Your account has been approved. You can now post ads and connect with buyers in Rwanda.</p>
        <a href="http://localhost:3000" style="background:#C9A84C; color:black; padding:12px 24px; text-decoration:none; border-radius:8px;">Start Posting Now</a>
      `,
    });
  },

  async sendPasswordResetOtp(email: string, otp: string) {
    const mailOptions = {
      from: `"HereNet" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Password Reset - HereNet',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Password Reset Request</h2>
          <p>You requested to reset your password. Use the code below to proceed:</p>
          <h1 style="color: #C9A84C; letter-spacing: 8px;">${otp}</h1>
          <p>This code will expire in 10 minutes.</p>
          <p style="color: #dc3545;">If you didn't request a password reset, please ignore this email and ensure your account is secure.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`📧 Password reset OTP sent to ${email}`);
  },
};

export default emailService;