import mongoose from 'mongoose';

const walletSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'role',
    required: true,
  },
  role: {
    type: String,
    enum: ['patient', 'doctor', 'admin'],
    required: true,
  },
  balance: {
    type: Number,
    default: 0, 
  },
  transactions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Transaction',
    },
  ],
}, { timestamps: true });

export default mongoose.model('Wallet', walletSchema);
