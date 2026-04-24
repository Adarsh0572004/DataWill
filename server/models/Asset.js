import mongoose from 'mongoose';

const assetSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  name: {
    type: String,
    required: [true, 'Asset name is required'],
    trim: true,
    maxlength: 200
  },
  platform: {
    type: String,
    trim: true,
    default: ''
  },
  type: {
    type: String,
    enum: ['social', 'storage', 'financial', 'creative', 'communication', 'other'],
    default: 'other'
  },
  category: {
    type: String,
    trim: true,
    default: ''
  },
  status: {
    type: String,
    enum: ['linked', 'pending', 'needs-rule', 'rule-set'],
    default: 'needs-rule'
  },
  icon: {
    type: String,
    default: '📦'
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true
});

export default mongoose.model('Asset', assetSchema);
