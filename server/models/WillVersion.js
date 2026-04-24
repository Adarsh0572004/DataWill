import mongoose from 'mongoose';

const willVersionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  version: { type: Number, required: true },
  snapshot: { type: mongoose.Schema.Types.Mixed, required: true },
  changeSummary: { type: String, default: '' }
}, { timestamps: true });

export default mongoose.model('WillVersion', willVersionSchema);
