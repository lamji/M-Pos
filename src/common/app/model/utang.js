import mongoose from 'mongoose';

// Define the item schema
const itemSchema = new mongoose.Schema({
  id: String,
  name: String,
  price: Number,
  quantity: Number,
  date: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true }, // Added isActive field
});

// Define the transaction schema
const transactionSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  amount: Number,
});

// Define the main utang schema
const utangSchema = new mongoose.Schema({
  items: [itemSchema],
  personName: { type: String, required: true },
  total: { type: Number, required: true },
  remainingBalance: { type: Number, required: true },
  transactions: [transactionSchema],
});

const Utang = mongoose.models.Utang || mongoose.model('Utang', utangSchema);

export default Utang;
