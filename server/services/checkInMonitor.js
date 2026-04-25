import cron from 'node-cron';
import CheckIn from '../models/CheckIn.js';
import User from '../models/User.js';
import { sendCheckInReminder } from './emailService.js';
import { triggerDeathProtocol } from './deathProtocol.js';

const MISS_THRESHOLD = 3; // Trigger death protocol after 3 consecutive misses

// Frequency in days
const FREQUENCY_DAYS = {
  monthly: 30,
  quarterly: 90,
};

/**
 * Check all users' check-in status.
 * - If overdue → increment missedCount, send reminder
 * - If missedCount >= MISS_THRESHOLD → trigger death protocol
 */
async function runCheckInMonitor() {
  console.log(`\n🔍 [Check-In Monitor] Running at ${new Date().toISOString()}`);

  try {
    const checkIns = await CheckIn.find({});
    let overdueCount = 0;
    let triggeredCount = 0;

    for (const checkIn of checkIns) {
      const freqDays = FREQUENCY_DAYS[checkIn.frequency] || 30;
      const now = new Date();
      const lastCheckIn = new Date(checkIn.lastCheckIn);
      const daysSince = (now - lastCheckIn) / (1000 * 60 * 60 * 24);

      // Check if snoozed
      if (checkIn.snoozedUntil && now < new Date(checkIn.snoozedUntil)) {
        continue; // Skip snoozed users
      }

      // Is the user overdue?
      if (daysSince > freqDays) {
        overdueCount++;
        const newMissedCount = checkIn.missedCount + 1;

        // Update the check-in record
        checkIn.missedCount = newMissedCount;
        checkIn.status = 'overdue';
        await checkIn.save();

        // Get user info for email
        const user = await User.findById(checkIn.userId);
        if (!user) continue;

        console.log(`  ⚠️ ${user.name} (${user.email}) — ${newMissedCount} missed check-in(s)`);

        if (newMissedCount >= MISS_THRESHOLD) {
          // 🚨 TRIGGER DEATH PROTOCOL
          console.log(`  🚨 THRESHOLD REACHED for ${user.name} — triggering death protocol!`);
          triggeredCount++;
          
          try {
            await triggerDeathProtocol(checkIn.userId);
            // Reset so we don't trigger repeatedly
            checkIn.missedCount = 0;
            checkIn.status = 'active';
            checkIn.lastCheckIn = now;
            await checkIn.save();
          } catch (err) {
            console.error(`  ❌ Death protocol failed for ${user.name}: ${err.message}`);
          }
        } else {
          // Send reminder email
          try {
            await sendCheckInReminder({
              userEmail: user.email,
              userName: user.name,
              missedCount: newMissedCount,
            });
          } catch (err) {
            console.error(`  ❌ Reminder email failed for ${user.name}: ${err.message}`);
          }
        }
      }
    }

    console.log(`  📊 Summary: ${checkIns.length} users checked, ${overdueCount} overdue, ${triggeredCount} triggered`);
  } catch (error) {
    console.error(`  ❌ Check-In Monitor error: ${error.message}`);
  }
}

/**
 * Start the cron job — runs every day at 9:00 AM
 */
export function startCheckInMonitor() {
  // Run daily at 9:00 AM
  cron.schedule('0 9 * * *', runCheckInMonitor, {
    timezone: 'Asia/Kolkata'
  });

  console.log('⏰ Check-In Monitor started (runs daily at 9:00 AM IST)');

  // Also run once on startup (after a delay to let DB connect)
  setTimeout(runCheckInMonitor, 10000);
}

// Export for manual testing
export { runCheckInMonitor };
