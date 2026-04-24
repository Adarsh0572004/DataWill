import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  name: {
    type: String,
    required: [true, 'Contact name is required'],
    trim: true,
    maxlength: 100
  },
  email: {
    type: String,
    required: [true, 'Contact email is required'],
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
  },
  phone: {
    type: String,
    trim: true,
    default: ''
  },
  role: {
    type: String,
    enum: ['trusted-contact', 'beneficiary', 'both'],
    default: 'beneficiary'
  },
  relationship: {
    type: String,
    trim: true,
    default: ''
  },
  verified: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

export default mongoose.model('Contact', contactSchema);
