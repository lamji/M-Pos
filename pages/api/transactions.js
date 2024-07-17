// pages/api/transactions.js
import { connectToDatabase } from '../../src/common/app/lib/mongodb';
import Transaction from '../../src/common/app/model/transaction';

export default async function handler(req, res) {
  const { method, query } = req;

  await connectToDatabase();

  switch (method) {
    case 'GET':
      try {
        console.log('Query:', query); // Log the incoming query parameters

        // Handle filtering by transactionType in a case-insensitive manner
        if (query.transactionType) {
          const transactionTypeRegex = new RegExp(query.transactionType, 'i');
          const transactions = await Transaction.find({ transactionType: transactionTypeRegex });

          // Combine transactions by name
          // const combinedTransactions = transactions.reduce((acc, transaction) => {
          //   const existingTransaction = acc.find(
          //     (t) => t?.name?.toLowerCase() === transaction?.name.toLowerCase()
          //   );
          //   if (existingTransaction) {
          //     existingTransaction.totalAmount += transaction.totalAmount;
          //     existingTransaction.items.push(...transaction.items);
          //   } else {
          //     acc.push({
          //       ...transaction._doc,
          //       totalAmount: transaction.totalAmount,
          //       items: [...transaction.items],
          //     });
          //   }
          //   return acc;
          // }, []);

          // console.log('Combined Transactions:', combinedTransactions); // Log the combined transactions
          return res.status(200).json(transactions);
        }

        // If no transactionType filter is provided, return all transactions
        const transactions = await Transaction.find({});
        res.status(200).json(transactions);
      } catch (error) {
        console.error('Error fetching transactions:', error); // Log the error
        res.status(500).json({ error: 'Failed to fetch transactions' });
      }
      break;

    case 'POST':
      try {
        const { items, personName, cash, total, partialAmount, type } = req.body;

        // Calculate remaining balance and change
        const change = cash ? cash - total : undefined;
        const remainingBalance = partialAmount ? total - partialAmount : undefined;

        const transactionData = {
          items,
          personName,
          cash,
          total,
          remainingBalance,
          partialAmount,
          change,
          transactionType: type,
        };

        const newTransaction = new Transaction(transactionData);
        await newTransaction.save();

        console.log(transactionData, newTransaction);

        res.status(201).json(newTransaction);
      } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Failed to add transaction' });
      }
      break;

    default:
      res.setHeader('Allow', ['POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
