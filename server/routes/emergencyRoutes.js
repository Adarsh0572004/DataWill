import express from 'express';
import crypto from 'crypto';
import User from '../models/User.js';
import CheckIn from '../models/CheckIn.js';

const router = express.Router();

// Hash a PIN with SHA-256
function hashPin(pin) {
  return crypto.createHash('sha256').update(pin.toString()).digest('hex');
}

/**
 * POST /api/emergency/set-pin
 * Set or update emergency cancel PIN (requires auth)
 */
router.post('/set-pin', async (req, res) => {
  try {
    const { pin } = req.body;
    
    if (!pin || !/^\d{6}$/.test(pin)) {
      return res.status(400).json({ message: 'PIN must be exactly 6 digits' });
    }

    // Get user ID from JWT or Better Auth session
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const hashedPin = hashPin(pin);
    await User.findByIdAndUpdate(userId, { emergencyPin: hashedPin });

    res.json({ message: 'Emergency PIN set successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * GET /api/emergency/pin-status
 * Check if user has set an emergency PIN
 */
router.get('/pin-status', async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) return res.status(401).json({ message: 'Authentication required' });

    const user = await User.findById(userId).select('+emergencyPin');
    res.json({ hasPin: !!user?.emergencyPin });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * POST /api/emergency/cancel
 * Cancel the death protocol — NO AUTH REQUIRED (accessible from any device)
 * Requires email + 6-digit PIN
 */
router.post('/cancel', async (req, res) => {
  try {
    const { email, pin } = req.body;

    if (!email || !pin) {
      return res.status(400).json({ message: 'Email and PIN are required' });
    }

    if (!/^\d{6}$/.test(pin)) {
      return res.status(400).json({ message: 'PIN must be exactly 6 digits' });
    }

    // Find user by email and include the PIN
    const user = await User.findOne({ email: email.toLowerCase() }).select('+emergencyPin');
    
    if (!user) {
      // Don't reveal whether user exists
      return res.status(400).json({ message: 'Invalid email or PIN' });
    }

    if (!user.emergencyPin) {
      return res.status(400).json({ message: 'No emergency PIN set for this account' });
    }

    // Verify PIN
    const hashedInput = hashPin(pin);
    if (hashedInput !== user.emergencyPin) {
      return res.status(400).json({ message: 'Invalid email or PIN' });
    }

    // PIN matches! Cancel the death protocol
    const checkIn = await CheckIn.findOne({ userId: user._id });
    if (!checkIn) {
      return res.json({ message: 'No active protocol to cancel' });
    }

    // Reset everything
    checkIn.missedCount = 0;
    checkIn.status = 'active';
    checkIn.lastCheckIn = new Date();
    checkIn.challengeStartedAt = null;
    checkIn.challengeEmailSent = false;
    await checkIn.save();

    console.log(`🛑 DEATH PROTOCOL CANCELLED by emergency PIN for ${user.email}`);

    res.json({ 
      message: '✅ Death protocol cancelled successfully! Your credentials are safe.',
      status: 'cancelled'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
