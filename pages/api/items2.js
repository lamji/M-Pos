import { connectToDatabase } from '../../src/common/app/lib/mongodb';
import Item from '../../src/common/app/model/Item';

export default async function handler(req, res) {
  const { method } = req;

  await connectToDatabase();

  switch (method) {
    case 'GET':
      try {
        const items = await Item.find({});

        // Handle filtering by barcode
        if (req.query.barcode) {
          const barcode = req.query.barcode.toLowerCase();
          const filteredItems = items.filter((item) => item.barcode.toLowerCase() === barcode);
          return res.status(200).json(filteredItems);
        }

        // Example: Filtering by `name` query parameter
        if (req.query.name) {
          const filteredItems = items.filter((item) =>
            item.name.toLowerCase().includes(req.query.name.toLowerCase())
          );
          return res.status(200).json(filteredItems);
        }

        res.status(200).json(items);
      } catch (error) {
        res.status(500).json({ error: 'Failed to fetch items' });
      }
      break;

    case 'POST':
      try {
        const { id, name, price, barcode, type, quantity, regularPrice } = req.body;

        // Check if an item with the same barcode already exists
        const existingItem = await Item.findOne({ barcode });

        if (existingItem && type === 'new') {
          return res.status(400).json({ error: 'Barcode already exists' });
        }

        let newItem;
        // var utangRecord = await Utang.findById(_id);

        if (existingItem) {
          // Update existing item
          const prevQty = existingItem.quantity || 0;
          const newQty = type === 'Add' ? prevQty + quantity : prevQty - quantity;

          // Update item fields
          existingItem.name = name || existingItem.name;
          existingItem.price = price || existingItem.price;
          existingItem.quantity = newQty;
          existingItem.regularPrice = regularPrice || existingItem.regularPrice;
          existingItem.quantityHistory.push({
            quantityChanged: quantity,
            date: new Date(),
            type: type,
          });

          await existingItem.save();
          res.status(201).json({ status: 'success' });
        } else {
          // Create new item if not found
          newItem = new Item({
            id,
            name,
            price,
            barcode,
            quantity,
            regularPrice,
          });
          if (type === 'Add' || type === 'Subtract') {
            newItem.quantityHistory.push({
              quantityChanged: quantity,
              date: new Date(),
              type: type,
            });
          }
          await newItem.save();
          res.status(201).json({ status: 'success' });
        }
      } catch (error) {
        res.status(500).json({ error: 'Failed to add or update item' });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
