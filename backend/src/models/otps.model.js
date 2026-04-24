import mongoose, { Schema, model } from 'mongoose';

const otpSchema = new Schema({
  email: {
    type: String,
  },
  otp: {
    type: String,
  },
  expiresAt: {
    type: Date,
  },
  otpType: {
    type: String
  }
});

// TTL index: document will auto-delete after `expiresAt`
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const Otp = model('Otp', otpSchema);

export default Otp;
