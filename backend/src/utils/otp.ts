// backend/src/utils/otp.ts

// In-memory OTP store with expiration
interface OtpEntry {
  otp: string;
  expiresAt: Date;
  attempts: number;
}

const otpStore = new Map<string, OtpEntry>(); // key = email

const OTP_EXPIRY_MINUTES = 10;
const MAX_ATTEMPTS = 3;

export const otpUtils = {
  /**
   * Generate a 6-digit OTP
   */
  generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  },

  /**
   * Store OTP for an email with expiration
   */
  storeOtp(email: string, otp: string): void {
    const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

    otpStore.set(email, {
      otp,
      expiresAt,
      attempts: 0,
    });

    console.log(`📧 OTP generated for ${email}: ${otp} (expires in ${OTP_EXPIRY_MINUTES} minutes)`);
  },

  /**
   * Verify OTP
   */
  verifyOtp(email: string, enteredOtp: string): { success: boolean; message: string } {
    const entry = otpStore.get(email);

    if (!entry) {
      return { success: false, message: 'No OTP found. Please request a new one.' };
    }

    // Check expiration
    if (new Date() > entry.expiresAt) {
      otpStore.delete(email);
      return { success: false, message: 'OTP has expired. Please request a new one.' };
    }

    // Check attempts
    if (entry.attempts >= MAX_ATTEMPTS) {
      otpStore.delete(email);
      return { success: false, message: 'Too many failed attempts. Please request a new OTP.' };
    }

    // Check OTP match
    if (entry.otp !== enteredOtp) {
      entry.attempts += 1;
      return { 
        success: false, 
        message: `Invalid OTP. ${MAX_ATTEMPTS - entry.attempts} attempts remaining.` 
      };
    }

    // Success - remove OTP
    otpStore.delete(email);
    return { success: true, message: 'OTP verified successfully' };
  },

  /**
   * Check if OTP exists for email
   */
  hasOtp(email: string): boolean {
    const entry = otpStore.get(email);
    if (!entry) return false;
    return new Date() < entry.expiresAt;
  },

  /**
   * Clean up expired OTPs (call periodically)
   */
  cleanupExpiredOtps(): void {
    const now = new Date();
    for (const [email, entry] of otpStore.entries()) {
      if (now > entry.expiresAt) {
        otpStore.delete(email);
      }
    }
  },

  /**
   * Get remaining time for OTP (in seconds)
   */
  getRemainingTime(email: string): number {
    const entry = otpStore.get(email);
    if (!entry) return 0;

    const remaining = Math.floor((entry.expiresAt.getTime() - Date.now()) / 1000);
    return Math.max(0, remaining);
  }
};

// Auto cleanup every 5 minutes
setInterval(() => {
  otpUtils.cleanupExpiredOtps();
}, 5 * 60 * 1000);

export default otpUtils;