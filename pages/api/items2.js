// pages/api/items.js
import { connectToDatabase } from '../../src/common/app/lib/mongodb';
import Item from '../../src/common/app/model/Item';

export default async function handler(req, res) {
  const { method, query } = req;

  await connectToDatabase();

  switch (method) {
    case 'GET':
      try {
        const items = await Item.find({});

        // Handle filtering by barcode
        if (query.barcode) {
          const barcode = query.barcode.toLowerCase();
          console.log(barcode);
          const filteredItems = items.filter((item) => item.barcode.toLowerCase() === barcode);
          console.log(query, filteredItems);
          return res.status(200).json(filteredItems);
        }

        // Example: Filtering by `name` query parameter
        if (query.name) {
          const filteredItems = items.filter((item) =>
            item.name.toLowerCase().includes(query.name.toLowerCase())
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
        const { id, name, price, barcode } = req.body;

        // Check if an item with the same barcode already exists
        const existingItem = await Item.findOne({ barcode });
        if (existingItem) {
          return res.status(400).json({ error: 'Barcode already exists' });
        }

        const newItem = new Item({ id, name, price, barcode });
        await newItem.save();
        res.status(201).json(newItem);
      } catch (error) {
        res.status(500).json({ error: 'Failed to add item' });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
