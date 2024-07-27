import { connectToDatabase } from '../../src/common/app/lib/mongodb';
import User from '../../src/common/app/model/Users';
import { verifyToken } from '../../utils/authMiddleware'; // Adjust the path as needed

export default async function handler(req, res) {
  const { method } = req;

  await connectToDatabase();

  async function getItemsWithPagination(req, res) {
    try {
      const { page = 1, limit = 10, barcode, name } = req.query;
      const { email } = req.user;

      // Convert page and limit to integers
      const pageNumber = parseInt(page, 10);
      const limitNumber = parseInt(limit, 10);

      // Find the user by email
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Filter items based on query parameters
      let filteredItems = user.items;
      if (barcode) {
        filteredItems = filteredItems.filter(
          (item) => item.barcode.toLowerCase() === barcode.toLowerCase()
        );
      }
      if (name) {
        filteredItems = filteredItems.filter((item) =>
          item.name.toLowerCase().includes(name.toLowerCase())
        );
      }

      // Implement pagination
      const paginatedItems = filteredItems.slice(
        (pageNumber - 1) * limitNumber,
        pageNumber * limitNumber
      );

      // Calculate the total number of pages
      const totalItems = filteredItems.length;
      const totalPages = Math.ceil(totalItems / limitNumber);

      res.status(200).json({
        items: paginatedItems,
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
      const { email } = req.user;

      // Find the user by email
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Filter items based on query parameters
      let filteredItems = user.items;
      if (barcode) {
        filteredItems = filteredItems.filter(
          (item) => item.barcode.toLowerCase() === barcode.toLowerCase()
        );
      }
      if (name) {
        filteredItems = filteredItems.filter((item) =>
          item.name.toLowerCase().includes(name.toLowerCase())
        );
      }

      res.status(200).json(filteredItems);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch all items' });
    }
  }

  switch (method) {
    case 'GET':
      try {
        verifyToken(req, res, async () => {
          const { page, limit } = req.query;

          if (page && limit) {
            await getItemsWithPagination(req, res);
          } else {
            await getAllItems(req, res);
          }
        });
      } catch (error) {
        res.status(500).json({ error: 'Failed to fetch items' });
      }
      break;

    case 'POST':
      try {
        verifyToken(req, res, async () => {
          const { id, name, price, barcode, type, quantity, regularPrice } = req.body;
          const { email } = req.user;

          // Find the user by email
          const user = await User.findOne({ email });

          if (!user) {
            return res.status(404).json({ error: 'User not found' });
          }

          // Check if an item with the same barcode already exists for the user
          const existingItem = user.items.find((item) => item.barcode === barcode);

          if (existingItem && type === 'new') {
            return res.status(400).json({ error: 'Barcode already exists' });
          }

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
          } else {
            // Create new item if not found
            const newItem = {
              id,
              name,
              price,
              barcode,
              quantity,
              regularPrice,
              user: email,
              quantityHistory: [],
            };
            if (type === 'Add' || type === 'Subtract') {
              newItem.quantityHistory.push({
                quantityChanged: quantity,
                date: new Date(),
                type: type,
              });
            }
            user.items.push(newItem);
          }

          await user.save();
          res.status(200).json({ status: 'success', data: user });
        });
      } catch (error) {
        res.status(500).json({ error: 'Failed to add or update item' });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
