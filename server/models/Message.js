import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  recipientContactId: { type: mongoose.Schema.Types.ObjectId, ref: 'Contact', required: true },
  subject: { type: String, required: true, trim: true },
  body: { type: String, default: '' },
  deliverySchedule: {
    type: String,
    enum: ['immediately', '1-week', '1-month', '6-months', '1-year', 'custom'],
    default: 'immediately'
  },
  customDate: { type: Date, default: null },
  status: { type: String, enum: ['draft', 'scheduled', 'sent'], default: 'draft' }
}, { timestamps: true });

export default mongoose.model('Message', messageSchema);
