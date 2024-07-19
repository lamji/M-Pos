/* eslint-disable no-self-assign */
import { connectToDatabase } from '../../src/common/app/lib/mongodb';
import Transaction from '../../src/common/app/model/transaction';
import Utang from '../../src/common/app/model/utang';

export default async function handler(req, res) {
  const { method, body, query } = req;

  await connectToDatabase();

  switch (method) {
    case 'GET':
      try {
        if (query.sales) {
          // Retrieve sales from yesterday and today
          const today = new Date();
          today.setHours(0, 0, 0, 0); // Set to the beginning of today

          const yesterday = new Date(today);
          yesterday.setDate(today.getDate() - 1); // Set to yesterday

          const tomorrow = new Date(today);
          tomorrow.setDate(today.getDate() + 1); // Set to tomorrow

          const transactionsToday = await Transaction.find({
            date: { $gte: today, $lt: tomorrow },
          });

          const transactionsYesterday = await Transaction.find({
            date: { $gte: yesterday, $lt: today },
          });

          // Helper function to calculate totals by transaction type
          const calculateTotalsByType = (transactions) => {
            const totals = {
              Cash: 0,
              Utang: 0,
            };

            transactions.forEach((transaction) => {
              if (transaction.transactionType === 'Cash') {
                totals.Cash += transaction.total;
              } else if (transaction.transactionType === 'Utang') {
                totals.Utang += transaction.total;
              }
            });

            return totals;
          };

          const totalsToday = calculateTotalsByType(transactionsToday);
          const totalsYesterday = calculateTotalsByType(transactionsYesterday);

          const totalSalesToday = transactionsToday.reduce(
            (total, transaction) => total + transaction.total,
            0
          );
          const totalSalesYesterday = transactionsYesterday.reduce(
            (total, transaction) => total + transaction.total,
            0
          );

          // Retrieve all transactions to calculate top 5 fast-moving items
          const allTransactions = await Transaction.find({});

          // Aggregate items and calculate their total quantities
          const itemMap = new Map();

          allTransactions.forEach((transaction) => {
            transaction.items.forEach((item) => {
              if (itemMap.has(item.name)) {
                itemMap.set(item.name, itemMap.get(item.name) + item.quantity);
              } else {
                itemMap.set(item.name, item.quantity);
              }
            });
          });

          // Convert map to array and sort by quantity in descending order
          const sortedItems = Array.from(itemMap.entries()).sort((a, b) => b[1] - a[1]);

          // Get top 5 fast-moving items
          const top5Items = sortedItems.slice(0, 5).map(([name, quantity]) => ({ name, quantity }));

          return res.status(200).json({
            today: {
              total: totalSalesToday,
              Cash: totalsToday.Cash,
              Utang: totalsToday.Utang,
            },
            dataToday: transactionsToday,
            yesterday: {
              total: totalSalesYesterday,
              Cash: totalsYesterday.Cash,
              Utang: totalsYesterday.Utang,
            },
            dataYesterday: transactionsYesterday,
            top5Items,
          });
        }

        let transactionsQuery = {};

        // Handle filtering by transactionType in a case-insensitive manner
        if (query.transactionType) {
          const transactionTypeRegex = new RegExp(query.transactionType, 'i');
          transactionsQuery.transactionType = transactionTypeRegex;
        }

        // Handle date filtering
        if (query.startDate && query.endDate) {
          const startDate = new Date(query.startDate);
          const endDate = new Date(query.endDate);
          endDate.setDate(endDate.getDate() + 1); // Include transactions on endDate day

          transactionsQuery.createdAt = {
            $gte: startDate,
            $lt: endDate,
          };
        }

        // Fetch transactions based on query parameters or fetch all if no query is provided
        const transactions = await Transaction.find(transactionsQuery);

        return res.status(200).json(transactions);
      } catch (error) {
        console.error('Error fetching transactions:', error);
        return res.status(500).json({ error: 'Failed to fetch transactions' });
      }

    case 'POST':
      try {
        const { items, personName, cash, total, partialAmount, type, _id, payment } = body;

        // Calculate remaining balance and change
        const change = cash ? cash - total : undefined;
        const remainingBalance = partialAmount ? total - partialAmount : undefined;
        const returnTotal = total;
        console.log(
          'items:',
          items,
          'personName,personName',
          'cash',
          'total:',
          total,
          partialAmount,
          type,
          _id,
          payment
        );

        if (type === 'Utang') {
          if (_id) {
            // If _id is provided, it is an existing 'utang' record to update
            var utangRecord = await Utang.findById(_id);
            if (!utangRecord) {
              return res.status(404).json({ error: 'Utang person name not found' });
            }

            // Add the incoming items to the existing items array
            utangRecord.items = [...utangRecord.items, ...items];

            // Recalculate the total amount
            utangRecord.total = utangRecord.items.reduce(
              (sum, item) => sum + item.price * item.quantity,
              0
            );

            // Recalculate the remaining balance based on total - previous payments
            utangRecord.remainingBalance =
              utangRecord.total -
              utangRecord.transactions.reduce((sum, transaction) => sum + transaction.amount, 0);

            // Update the personName, cash, total, remainingBalance, and transactionType fields
            utangRecord.personName = personName;
            utangRecord.cash = cash;
            utangRecord.total = utangRecord.remainingBalance; // This line is technically redundant but keeps the clarity
            utangRecord.remainingBalance = utangRecord.remainingBalance; // Ensure this is updated
            utangRecord.transactionType = type;

            console.log(utangRecord);
            // Save the updated 'utang' record
            // await utangRecord.save();

            // Create and save the new transaction record
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

            // Send the response
            return res.status(201).json({
              data: newTransaction,
              total: returnTotal,
              remainingBalance: remainingBalance,
            });
          } else {
            // Create a new 'utang' record
            const newUtangRecord = new Utang({
              items,
              personName,
              total,
              remainingBalance: total,
              transactions: payment ? [{ date: new Date(), amount: payment.amount }] : [],
            });

            await newUtangRecord.save();
            // Create a new transaction record for the 'utang' type
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

            return res.status(201).json({
              data: newTransaction,
              total: returnTotal,
              remainingBalance: remainingBalance,
            });
          }
        }

        if (type === 'partial') {
          if (_id) {
            // If _id is provided, it is an existing 'utang' record to update
            const utangRecord = await Utang.findById(_id);
            if (!utangRecord) {
              return res.status(404).json({ error: 'Utang person name not found' });
            }

            // Add the incoming items to the existing items array
            utangRecord.items = [...utangRecord.items, ...items];

            // Recalculate the total amount including the incoming items and the new total to add
            const newTotal = utangRecord.total;

            const utangToAdd = total - partialAmount;
            utangRecord.total = newTotal + utangToAdd; // Update total to include the new amount

            // Recalculate the remaining balance based on the new total and previous payments
            utangRecord.remainingBalance =
              utangRecord.total -
              utangRecord.transactions.reduce((sum, transaction) => sum + transaction.amount, 0);

            // Update the personName, cash, transactionType fields
            utangRecord.personName = personName;
            utangRecord.cash = cash;
            utangRecord.transactionType = type;

            // Save the updated 'utang' record
            await utangRecord.save();

            // Create and save the new transaction record for the partial payment
            const transactionData = {
              items,
              personName,
              cash,
              total: partialAmount, // The amount paid in this transaction
              remainingBalance: remainingBalance, // Updated remaining balance
              partialAmount,
              change,
              transactionType: type,
            };

            const newTransaction = new Transaction(transactionData);
            await newTransaction.save();

            // Send the response
            return res.status(201).json({
              data: newTransaction,
              total: returnTotal,
              remainingBalance: remainingBalance,
            });
          } else {
            // If _id is not provided, create a new 'utang' record
            const utangToAdd = total - partialAmount;

            const newUtangRecord = new Utang({
              items,
              personName,
              total,
              remainingBalance: utangToAdd, // Remaining balance to be paid later
              transactions: payment ? [{ date: new Date(), amount: payment.amount }] : [],
            });

            await newUtangRecord.save();

            // Create and save the new transaction record for the partial payment
            const transactionData = {
              items,
              personName,
              cash,
              total: partialAmount, // The amount paid in this transaction
              remainingBalance: utangToAdd, // Remaining balance to be paid later
              partialAmount,
              change,
              transactionType: type,
            };

            const newTransaction = new Transaction(transactionData);
            await newTransaction.save();

            return res.status(201).json({
              data: newTransaction,
              total: returnTotal,
              remainingBalance: remainingBalance,
            });
          }
        }

        // Create a new transaction record
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

        return res.status(201).json({
          data: newTransaction,
          total: returnTotal,
          remainingBalance: remainingBalance,
        });
      } catch (error) {
        console.error('Error creating transaction:', error);
        return res.status(500).json({ error: 'Failed to create transaction' });
      }

    default:
      return res
        .setHeader('Allow', ['GET', 'POST'])
        .status(405)
        .end(`Method ${method} Not Allowed`);
  }
}
