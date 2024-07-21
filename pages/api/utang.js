// pages/api/utang.js
import moment from 'moment/moment';
import { connectToDatabase } from '../../src/common/app/lib/mongodb';
import Utang from '../../src/common/app/model/utang';

export default async function handler(req, res) {
  const { method } = req;

  await connectToDatabase();

  switch (method) {
    case 'GET':
      try {
        const { _id } = req.query;

        let utang;
        if (_id) {
          utang = await Utang.findById(_id);
          if (!utang) {
            return res.status(404).json({ error: 'Utang not found' });
          }
          utang = [utang]; // Ensure utang is an array for consistent response format
        } else {
          utang = await Utang.find({});
          utang = utang.filter((entry) => entry.total > 0);
        }

        // Sort utang by date in ascending order (earliest items first)
        utang.sort((a, b) => new Date(a.date) - new Date(b.date));

        utang.forEach((entry, index) => {
          entry.number = index + 1;
        });

        const totalUtang = utang.reduce((sum, entry) => {
          return sum + entry.total;
        }, 0);

        res.status(200).json({ utang, totalUtang });
      } catch (error) {
        res.status(500).json({ error: 'Failed to fetch utang' });
      }

      break;

    case 'POST':
      try {
        const { items, name, _id, payment } = req.body;
        const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        // console.log(items, name, _id, payment);
        // // Calculate the total amount based on items
        // const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

        if (_id) {
          // If _id is provided, determine if it is a payment or an update
          let utang = await Utang.findById(_id);
          if (!utang) {
            return res.status(404).json({ error: 'Utang not found' });
          }

          if (payment) {
            // Check for payment transactions
            // utang.remainingBalance -= payment.amount;
            const totalDb = utang.total;
            const type = payment.amount >= totalDb ? 'full' : 'partial';
            utang.transactions.push({ date: new Date(), amount: payment.amount });
            if (type === 'full') {
              // If full payment, empty the items array
              utang.items = [];
              utang.total = 0;
              utang.remainingBalance = 0;
            } else {
              // If partial payment, empty the items array and add a new item
              const remainingBalance = totalDb - payment.amount;
              utang.items = [
                {
                  name: 'Balance for date ' + moment().format('ll'),
                  price: remainingBalance,
                  quantity: 0,
                  date: new Date(),
                },
              ];
              utang.total = remainingBalance;
              utang.remainingBalance = remainingBalance;
            }
          } else {
            // Update the existing utang
            utang.items = items; // Update the items list
            utang.total = total; // Recalculate the total amount
            // No need to set remainingBalance from body; it's recalculated based on total - previous payments
            utang.remainingBalance =
              total - utang.transactions.reduce((sum, transaction) => sum + transaction.amount, 0);
          }
          await utang.save();

          res.status(200).json({ utang: 'success' });
        } else {
          // Create a new utang
          const remainingBalance = total;
          const newUtang = new Utang({
            items,
            name,
            total,
            remainingBalance,
            transactions: payment ? [{ date: new Date(), amount: payment.amount }] : [],
          });
          await newUtang.save();
          res.status(201).json(newUtang);
        }
      } catch (error) {
        res.status(500).json({ error: 'Failed to add/update utang' });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
