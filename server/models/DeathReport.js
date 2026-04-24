import mongoose from 'mongoose';

const deathReportSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Contact',
    required: true
  },
  certificateUrl: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['pending', 'challenged', 'confirmed', 'cancelled'],
    default: 'pending'
  },
  confirmations: [{
    contactId: { type: mongoose.Schema.Types.ObjectId, ref: 'Contact' },
    confirmedAt: { type: Date, default: Date.now }
  }],
  challengeDeadline: {
    type: Date,
    required: true
  }
}, { timestamps: true });

export default mongoose.model('DeathReport', deathReportSchema);
