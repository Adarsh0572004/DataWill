import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  action: { type: String, required: true },
  details: { type: String, default: '' },
  ipAddress: { type: String, default: '' },
  timestamp: { type: Date, default: Date.now }
});

export default mongoose.model('AuditLog', auditLogSchema);
