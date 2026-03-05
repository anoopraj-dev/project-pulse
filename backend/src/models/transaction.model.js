import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  wallet: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Wallet',
    required: true,
  },
  type: {
    type: String,
    enum: ['credit', 'debit'],
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  referenceType: {
    type: String,
    enum: ['payment', 'refund', 'transfer'],
    required: true,
  },
  referenceId: {
    type: mongoose.Schema.Types.ObjectId, 
    required: true,
  },
  notes: String,
  date:{
    type:Date,
    default:Date.now()
  }
}, { timestamps: true });

export default mongoose.model('Transaction', transactionSchema);
