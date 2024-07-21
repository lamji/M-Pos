import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  transactionType: {
    type: String,
    required: true,
  },
  items: {
    type: [{ id: String, name: String, quantity: Number, price: Number }],
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
    required: true,
  },
  personName: {
    type: String,
    required: false,
  },
  cash: {
    type: Number,
    required: false,
  },
  total: {
    type: Number,
    required: true,
  },
  remainingBalance: {
    type: Number,
    required: false,
  },
  partialAmount: {
    type: Number,
    required: false,
  },
  change: {
    type: Number,
    required: false,
  },
});

// Define a method to calculate the remaining balance and change
transactionSchema.pre('save', function (next) {
  if (this.cash) {
    this.change = this.cash - this.total;
  }

  if (this.partialAmount && this.total) {
    this.remainingBalance = this.total - this.partialAmount;
  }

  next();
});

const Transaction = mongoose.models.Transaction || mongoose.model('Transaction', transactionSchema);
export default Transaction;
