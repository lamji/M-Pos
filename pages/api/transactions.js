/* eslint-disable no-self-assign */
import { connectToDatabase } from '../../src/common/app/lib/mongodb';
import Transaction from '../../src/common/app/model/transaction';
import timeZone from 'moment-timezone';
import { updateItem, getItemQuantities, getTopFastMovingItems } from '../../utils/updateItem';
import { addTransactionUtang } from '../../utils/utangTransaction';
import { updatePartialTransactions } from '../../utils/partialTransaction';

export default async function handler(req, res) {
  const { method, body, query } = req;

  await connectToDatabase();

  switch (method) {
    case 'GET':
      try {
        if (query.sales) {
          const today = timeZone().tz('Asia/Manila').startOf('day'); // Set to the beginning of today in PH time zone

          const yesterday = timeZone(today).subtract(1, 'days'); // Set to the beginning of yesterday in PH time zone

          const tomorrow = timeZone(today).add(1, 'days'); // Set to the beginning of tomorrow in PH time zone

          const transactionsToday = await Transaction.find({
            date: { $gte: today, $lt: tomorrow },
          });

          console.log(transactionsToday);

          const transactionsYesterday = await Transaction.find({
            date: { $gte: yesterday, $lt: today },
          });

          // Helper function to calculate totals by transaction type
          const calculateTotalsByType = (transactions) => {
            const totals = {
              Cash: 0,
              Utang: 0,
              balance: 0,
            };

            transactions.forEach((transaction) => {
              if (transaction.transactionType === 'Cash') {
                totals.Cash += transaction.total;
              } else if (transaction.transactionType === 'Utang') {
                totals.Utang += transaction.total;
              } else if (transaction.transactionType === 'partial') {
                console.log('Partial Transaction:', transaction);
                totals.balance += transaction.remainingBalance;
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

          // Call the function (for testing purposes)
          const top5Items = await getTopFastMovingItems();
          const top5ItemsWithQuantities = await getItemQuantities(top5Items);

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
            top5ItemsWithQuantities,
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
        const { items, personName, cash, total, partialAmount, type } = body;
        updateItem(req);
        // Calculate remaining balance and change
        const change = cash ? cash - total : undefined;
        const remainingBalance = partialAmount ? total - partialAmount : undefined;
        const returnTotal = total;

        if (type === 'Utang') {
          const utangResult = await addTransactionUtang(req);

          if (utangResult.success) {
            return res.status(200).json({
              success: true,
              message: 'Utang transaction created successfully',
              data: utangResult.data,
              total: total,
            });
          } else {
            return res.status(500).json({ error: 'Failed to create utang transaction' });
          }
        }

        if (type === 'partial') {
          const partialResult = await updatePartialTransactions(req);

          if (partialResult.success) {
            return res.status(200).json({
              success: true,
              message: 'Utang transaction created successfully',
              data: partialResult.data,
              total: total,
              change: total - partialAmount,
              partialAmount: partialAmount,
              remainingBalance,
            });
          } else {
            return res.status(500).json({ error: 'Failed to create utang transaction' });
          }
        }

        // Create a new transaction record
        if (type === 'Cash') {
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
            remainingBalance: 0,
            change: cash - total, // to do save to db
          });
        }
      } catch (error) {
        console.error('Error creating transaction:', error);
        return res.status(500).json({ error: 'Failed to create transaction test' });
      }
      return res.status(500).json({ error: 'Transaction type not handled' });
    default:
      return res
        .setHeader('Allow', ['GET', 'POST'])
        .status(405)
        .end(`Method ${method} Not Allowed`);
  }
}
