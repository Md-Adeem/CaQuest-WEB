const cron = require('node-cron');
const User = require('../models/User');
const { sendEmail, emailTemplates } = require('./email');

const setupCronJobs = () => {
  // Run daily at 9:00 AM - Check expiring subscriptions
  cron.schedule('0 9 * * *', async () => {
    console.log('🕐 Running subscription expiry check...');

    try {
      const users = await User.find({
        'activeSubscriptions.0': { $exists: true },
        role: 'student',
      });

      const levelNames = {
        foundation: 'CA Foundation',
        intermediate: 'CA Intermediate',
        final: 'CA Final',
      };

      let notificationCount = 0;

      for (const user of users) {
        for (const sub of user.activeSubscriptions) {
          const now = new Date();
          const expiry = new Date(sub.expiresAt);
          const daysLeft = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24));

          // Send notification at 7 days and 3 days before expiry
          if (daysLeft === 7 || daysLeft === 3 || daysLeft === 1) {
            const emailData = emailTemplates.subscriptionExpiring(
              user.name,
              levelNames[sub.level],
              daysLeft
            );
            await sendEmail({ to: user.email, ...emailData });
            notificationCount++;
          }
        }
      }

      console.log(`✅ Sent ${notificationCount} expiry notifications`);
    } catch (error) {
      console.error('❌ Cron job error:', error);
    }
  });

  // Run weekly - Clean up expired subscriptions display
  cron.schedule('0 0 * * 0', async () => {
    console.log('🕐 Running weekly cleanup...');

    try {
      const result = await User.updateMany(
        {},
        {
          $pull: {
            activeSubscriptions: {
              expiresAt: { $lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
            },
          },
        }
      );
      console.log(`✅ Cleaned up ${result.modifiedCount} expired subscriptions`);
    } catch (error) {
      console.error('❌ Cleanup error:', error);
    }
  });

  // Run daily at 10:00 AM - Check low streaks for subscribed users
  cron.schedule('0 10 * * *', async () => {
    console.log('🕐 Running low streak check...');

    try {
      const now = new Date();
      // Find students whose streak is less than 4 and who have an active unexpired subscription
      const users = await User.find({
        role: 'student',
        currentStreak: { $lt: 4 },
        activeSubscriptions: { 
          $elemMatch: { expiresAt: { $gt: now } } 
        }
      });

      let notificationCount = 0;

      for (const user of users) {
        // Send the low streak reminder email
        const emailData = emailTemplates.lowStreakReminder(user.name, user.currentStreak || 0);
        await sendEmail({ to: user.email, ...emailData });
        notificationCount++;
      }

      console.log(`✅ Sent ${notificationCount} low streak reminders`);
    } catch (error) {
      console.error('❌ Cron job low streak error:', error);
    }
  });

  console.log('⏰ Cron jobs scheduled');
};

module.exports = setupCronJobs;