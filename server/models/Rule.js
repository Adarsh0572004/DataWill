import mongoose from 'mongoose';

const ruleSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  assetId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Asset',
    required: [true, 'Asset is required']
  },
  action: {
    type: String,
    enum: ['transfer', 'delete', 'archive', 'memorialize', 'schedule-message'],
    required: [true, 'Action is required']
  },
  beneficiaryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Contact',
    default: null
  },
  description: {
    type: String,
    trim: true,
    default: ''
  },
  conditions: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true
});

export default mongoose.model('Rule', ruleSchema);
