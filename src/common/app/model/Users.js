import mongoose from 'mongoose';

// Define the item schema
const itemSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  partial: { type: Number, required: false },
  barcode: { type: String, required: true },
  quantity: { type: Number, required: false }, // remaining stocks
  regularPrice: { type: Number, required: false }, // regular price
  date: { type: Date, default: Date.now }, // date field with default value
  quantityHistory: [
    {
      quantityChanged: { type: Number, required: true },
      date: { type: Date, required: true },
      type: { type: String, required: false },
    },
  ],
});

// Define the transaction schema
const transactionSchema = new mongoose.Schema({
  date: {
    type: Date,
    default: Date.now,
  },
  transactionType: {
    type: String,
    required: false,
  },
  items: [
    {
      id: String,
      name: String,
      quantity: Number,
      price: Number,
    },
  ],
  cash: {
    type: Number,
    required: false,
  },
  total: {
    type: Number,
    required: true,
  },
  partialAmount: {
    type: Number,
    required: false,
  },
  remainingBalance: {
    type: Number,
    required: false,
  },
  change: {
    type: Number,
    required: false,
  },
});

const utangTransactionSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  amount: Number,
});

// Define the utang schema
const utangSchema = new mongoose.Schema({
  items: [
    {
      id: String,
      name: String,
      price: Number,
      quantity: Number,
    },
  ],
  personName: {
    type: String,
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
  remainingBalance: {
    type: Number,
    required: true,
  },
  transactions: [utangTransactionSchema],
  date: {
    type: Date,
    default: Date.now,
  },
});

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    subscription: {
      code: {
        type: String,
        unique: true,
      },
      isActive: {
        type: Boolean,
        default: false,
      },
      expiryDate: {
        type: Date,
      },
      paymentHistory: [
        {
          gcashRefNumber: String,
          amount: Number,
          date: Date,
        },
      ],
    },
    items: [itemSchema], // Add items field
    utangs: [utangSchema], // Add utangs field
    transactions: [transactionSchema], // Add transactions field
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model('User', UserSchema);
