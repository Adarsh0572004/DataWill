import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
  },
  passwordHash: {
    type: String,
    required: [true, 'Password is required'],
    select: false  // Never return passwordHash in queries by default
  },
  mfaEnabled: {
    type: Boolean,
    default: false
  },
  lastCheckIn: {
    type: Date,
    default: Date.now
  },
  // Hashed 6-digit emergency cancel PIN
  emergencyPin: {
    type: String,
    default: null,
    select: false
  }
}, {
  timestamps: true  // adds createdAt, updatedAt
});

export default mongoose.model('User', userSchema);
