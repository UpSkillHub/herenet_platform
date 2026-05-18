// backend/src/jobs/expiry.job.ts
import cron from 'node-cron';
import prisma from '../config/database';

export class ExpiryJob {
  /**
   * Start the ad expiration job
   */
  static start() {
    console.log('⏰ Ad Expiry Job Started - Checking every hour');

    // Run every hour (you can change to '*' for every minute during testing)
    cron.schedule('0 * * * *', async () => {
      await this.checkAndExpireAds();
    });

    // Also run immediately on startup
    this.checkAndExpireAds();
  }

  /**
   * Check and expire ads that have passed their expiry date
   */
  private static async checkAndExpireAds() {
    try {
      const now = new Date();

      const expiredAds = await prisma.ad.updateMany({
        where: {
          status: 'approved',
          expiryDate: {
            lt: now, // Less than current time
          },
        },
        data: {
          status: 'expired',
        },
      });

      if (expiredAds.count > 0) {
        console.log(`✅ Expired ${expiredAds.count} ads successfully`);
      } else {
        console.log('📌 No ads to expire at this time');
      }
    } catch (error) {
      console.error('❌ Error in expiry job:', error);
    }
  }

  /**
   * Manual trigger (useful for testing)
   */
  static async triggerNow() {
    console.log('🔧 Manually triggering expiry check...');
    await this.checkAndExpireAds();
  }
}

export default ExpiryJob;