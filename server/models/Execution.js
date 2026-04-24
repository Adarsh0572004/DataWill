import mongoose from 'mongoose';

const executionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  ruleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Rule',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'completed', 'failed'],
    default: 'pending'
  },
  executedAt: { type: Date, default: null },
  result: { type: String, default: '' },
  errorMessage: { type: String, default: '' }
}, { timestamps: true });

export default mongoose.model('Execution', executionSchema);
