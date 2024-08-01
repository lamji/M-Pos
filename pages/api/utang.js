import moment from 'moment/moment';
import { connectToDatabase } from '../../src/common/app/lib/mongodb';
import User from '../../src/common/app/model/Users';
import { verifyToken } from '../../utils/authMiddleware';

export default async function handler(req, res) {
  await connectToDatabase();

  return verifyToken(req, res, async () => {
    const { method } = req;
    const { _id, email } = req.user; // Assume req.user has email from token

    switch (method) {
      case 'GET':
        try {
          // Fetch the user by email (from token)
          const user = await User.findOne({ email });
          if (!user) {
            return res.status(404).json({ error: 'User not found' });
          }

          const { utangs } = user;

          let filteredUtangs;
          if (_id) {
            filteredUtangs = utangs.filter((utang) => utang._id.toString() === _id);
            if (filteredUtangs.length === 0) {
              return res.status(404).json({ error: 'Utang not found' });
            }
          } else {
            filteredUtangs = utangs.filter((utang) => utang.total > 0);
          }

          // Sort utang by date in ascending order (earliest items first)
          filteredUtangs.sort((a, b) => new Date(a.date) - new Date(b.date));

          // Add a number property to each entry for display purposes
          filteredUtangs.forEach((entry, index) => {
            entry.number = index + 1;
          });

          // Calculate the total outstanding amount
          const totalUtang = filteredUtangs.reduce((sum, entry) => sum + entry.total, 0);

          // Get a list of all Utang names
          const listUtangName = user.utangs.map((item) => ({
            _id: item._id,
            personName: item.personName,
          }));

          res.status(200).json({ utang: filteredUtangs, totalUtang, listUtangName });
        } catch (error) {
          res.status(500).json({ error: 'Failed to fetch utang' });
        }
        break;

      case 'POST':
        try {
          const { items, name, _id, payment } = req.body;

          // Fetch the user by email (from token)
          const user = await User.findOne({ email });
          if (!user) {
            return res.status(404).json({ error: 'User not found' });
          }

          const utangs = user.utangs;
          let utang;
          let change = 0;

          if (_id) {
            utang = utangs.find((utang) => utang._id.toString() === _id);
            if (!utang) {
              return res.status(404).json({ error: 'Utang not found' });
            }

            if (payment) {
              // Handle payment
              const totalDb = utang.total;
              const type = payment.amount >= totalDb ? 'full' : 'partial';

              utang.transactions.push({ date: new Date(), amount: payment.amount });
              if (type === 'full') {
                change = payment.amount - utang.total;
                utang.items = [];
                utang.total = 0;
                utang.remainingBalance = 0;
              } else {
                change = payment.amount - utang.total;
                const remainingBalance = totalDb - payment.amount;
                utang.items = [
                  {
                    name: 'Balance for date ' + moment().format('ll'),
                    price: remainingBalance,
                    quantity: 1,
                    date: new Date(),
                  },
                ];
                utang.total = remainingBalance;
                utang.remainingBalance = remainingBalance;
              }
            } else {
              // Update the existing utang
              const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
              utang.items = items;
              utang.total = total;
              utang.remainingBalance =
                total -
                utang.transactions.reduce((sum, transaction) => sum + transaction.amount, 0);
            }
          } else {
            // Create a new utang
            const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
            const remainingBalance = total;
            utang = {
              items,
              personName: name,
              total,
              remainingBalance,
              transactions: payment ? [{ date: new Date(), amount: payment.amount }] : [],
            };
            user.utangs.push(utang);
          }

          // Save the user with the updated utangs
          await user.save();

          res.status(200).json({ utang: 'success', change });
        } catch (error) {
          console.error(error);
          res.status(500).json({ error: 'Failed to add/update utang' });
        }
        break;

      default:
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  });
}
