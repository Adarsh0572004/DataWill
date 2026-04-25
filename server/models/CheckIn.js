import mongoose from 'mongoose';

const checkInSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
    index: true
  },
  frequency: {
    type: String,
    enum: ['monthly', 'quarterly'],
    default: 'monthly'
  },
  lastCheckIn: {
    type: Date,
    default: Date.now
  },
  missedCount: {
    type: Number,
    default: 0
  },
  snoozedUntil: {
    type: Date,
    default: null
  },
  status: {
    type: String,
    enum: ['active', 'overdue', 'snoozed', 'challenge'],
    default: 'active'
  },
  // 72-hour challenge window
  challengeStartedAt: {
    type: Date,
    default: null
  },
  challengeEmailSent: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

export default mongoose.model('CheckIn', checkInSchema);
