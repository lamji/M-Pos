import mongoose from 'mongoose';

const ItemSchema = new mongoose.Schema({
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

export default mongoose.models.Item || mongoose.model('Item', ItemSchema);
