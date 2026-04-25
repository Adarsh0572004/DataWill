import cron from 'node-cron';
import CheckIn from '../models/CheckIn.js';
import User from '../models/User.js';
import { sendCheckInReminder, sendChallengeEmail } from './emailService.js';
import { triggerDeathProtocol } from './deathProtocol.js';

const MISS_THRESHOLD = 3; // Start 72h challenge after 3 consecutive misses
const CHALLENGE_HOURS = 72; // 72-hour grace period before executing

// Frequency in days
const FREQUENCY_DAYS = {
  monthly: 30,
  quarterly: 90,
};

/**
 * Check all users' check-in status.
 * 
 * Flow:
 * 1. Miss 1-2 check-ins → send reminder email
 * 2. Miss 3+ → start 72-HOUR CHALLENGE WINDOW
 * 3. After 72 hours of challenge with no cancel → trigger death protocol
 */
async function runCheckInMonitor() {
  console.log(`\n🔍 [Check-In Monitor] Running at ${new Date().toISOString()}`);

  try {
    const checkIns = await CheckIn.find({});
    let overdueCount = 0;
    let challengeCount = 0;
    let triggeredCount = 0;

    for (const checkIn of checkIns) {
      const freqDays = FREQUENCY_DAYS[checkIn.frequency] || 30;
      const now = new Date();
      const lastCheckIn = new Date(checkIn.lastCheckIn);
      const daysSince = (now - lastCheckIn) / (1000 * 60 * 60 * 24);

      // Check if snoozed
      if (checkIn.snoozedUntil && now < new Date(checkIn.snoozedUntil)) {
        continue;
      }

      // Is the user overdue?
      if (daysSince <= freqDays) continue; // All good, skip

      overdueCount++;
      const user = await User.findById(checkIn.userId);
      if (!user) continue;

      // ─── CHALLENGE MODE: Already in 72-hour window ───
      if (checkIn.status === 'challenge' && checkIn.challengeStartedAt) {
        const hoursSinceChallenge = (now - new Date(checkIn.challengeStartedAt)) / (1000 * 60 * 60);

        if (hoursSinceChallenge >= CHALLENGE_HOURS) {
          // 🚨 72 hours passed — EXECUTE DEATH PROTOCOL
          console.log(`  🚨 72h CHALLENGE EXPIRED for ${user.name} — executing death protocol!`);
          triggeredCount++;

          try {
            await triggerDeathProtocol(checkIn.userId);
            // Reset after execution
            checkIn.missedCount = 0;
            checkIn.status = 'active';
            checkIn.lastCheckIn = now;
            checkIn.challengeStartedAt = null;
            checkIn.challengeEmailSent = false;
            await checkIn.save();
          } catch (err) {
            console.error(`  ❌ Death protocol failed for ${user.name}: ${err.message}`);
          }
        } else {
          const hoursLeft = Math.round(CHALLENGE_HOURS - hoursSinceChallenge);
          console.log(`  ⏳ ${user.name} in challenge window — ${hoursLeft}h remaining`);
        }
        continue;
      }

      // ─── NORMAL OVERDUE: Count misses ───
      const newMissedCount = checkIn.missedCount + 1;
      checkIn.missedCount = newMissedCount;
      checkIn.status = 'overdue';

      console.log(`  ⚠️ ${user.name} (${user.email}) — ${newMissedCount} missed check-in(s)`);

      if (newMissedCount >= MISS_THRESHOLD) {
        // ─── START 72-HOUR CHALLENGE WINDOW ───
        challengeCount++;
        checkIn.status = 'challenge';
        checkIn.challengeStartedAt = now;
        checkIn.challengeEmailSent = true;
        await checkIn.save();

        console.log(`  🟡 72-HOUR CHALLENGE STARTED for ${user.name}`);

        // Send challenge email
        try {
          await sendChallengeEmail({
            userEmail: user.email,
            userName: user.name,
          });
        } catch (err) {
          console.error(`  ❌ Challenge email failed for ${user.name}: ${err.message}`);
        }
      } else {
        await checkIn.save();

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

    console.log(`  📊 Summary: ${checkIns.length} users, ${overdueCount} overdue, ${challengeCount} challenges started, ${triggeredCount} executed`);
  } catch (error) {
    console.error(`  ❌ Check-In Monitor error: ${error.message}`);
  }
}

/**
 * Start the cron job — runs every day at 9:00 AM
 */
export function startCheckInMonitor() {
  cron.schedule('0 9 * * *', runCheckInMonitor, {
    timezone: 'Asia/Kolkata'
  });

  console.log('⏰ Check-In Monitor started (runs daily at 9:00 AM IST)');

  // Also run once on startup (after a delay to let DB connect)
  setTimeout(runCheckInMonitor, 10000);
}

export { runCheckInMonitor };
