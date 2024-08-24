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

      return res.status(200).json({
        items: paginatedItems,
        pagination: {
          totalItems,
          totalPages,
          currentPage: pageNumber,
          limit: limitNumber,
        },
      });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch items with pagination' });
    }
  }

  async function getAllItems(req, res) {
    try {
      const { email } = req.user;

      // Ensure email is present in req.user
      if (!email) {
        return res.status(400).json({ error: 'User email is required' });
      }

      // Find the user by email
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // If no items match the criteria, return an empty array
      return res.status(200).json(user);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch all items' });
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

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
