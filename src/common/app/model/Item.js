// models/Item.js
import mongoose from 'mongoose';

const ItemSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  barcode: { type: String, required: true },
});

export default mongoose.models.Item || mongoose.model('Item', ItemSchema);
