import { connectToDatabase } from '../../src/common/app/lib/mongodb';
import Item from '../../src/common/app/model/Item';

export default async function handler(req, res) {
  const { method } = req;

  await connectToDatabase();

  async function getItemsWithPagination(req, res) {
    try {
      const { page = 1, limit = 10, barcode, name } = req.query;

      // Convert page and limit to integers
      const pageNumber = parseInt(page, 10);
      const limitNumber = parseInt(limit, 10);

      // Build the query object
      const query = {};
      if (barcode) {
        query.barcode = barcode.toLowerCase();
      }

      if (name) {
        query.name = { $regex: name, $options: 'i' };
      }

      // Find items with pagination
      const items = await Item.find(query)
        .skip((pageNumber - 1) * limitNumber)
        .limit(limitNumber);

      // Get the total count of items matching the query
      const totalItems = await Item.countDocuments(query);

      // Calculate the total number of pages
      const totalPages = Math.ceil(totalItems / limitNumber);

      res.status(200).json({
        items,
        pagination: {
          totalItems,
          totalPages,
          currentPage: pageNumber,
          limit: limitNumber,
        },
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch items with pagination' });
    }
  }

  async function getAllItems(req, res) {
    try {
      const { barcode, name } = req.query;

      // Build the query object
      const query = {};
      if (barcode) {
        query.barcode = barcode.toLowerCase();
      }
      if (name) {
        query.name = { $regex: name.toLowerCase(), $options: 'i' };
      }

      // Find all items matching the query
      const items = await Item.find(query);

      res.status(200).json(items);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch all items' });
    }
  }

  switch (method) {
    case 'GET':
      try {
        const { page, limit } = req.query;

        if (page && limit) {
          await getItemsWithPagination(req, res);
        } else {
          await getAllItems(req, res);
        }
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
          if (type === 'Add' || type === 'Adjustment') {
            existingItem.quantity = newQty;
          } else {
            existingItem.quantity = quantity;
          }

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
