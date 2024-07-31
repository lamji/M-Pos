import User from '../../src/common/app/model/Users';
import { connectToDatabase } from '../../src/common/app/lib/mongodb';
import { verifyToken } from '../../utils/authMiddleware';
import timeZone from 'moment-timezone';
import { updateItem, getItemQuantities, getTopFastMovingItems } from '../../utils/updateItem';
import { addTransactionUtang } from '../../utils/utangTransaction';
import { updatePartialTransactions } from '../../utils/partialTransaction';

export default async function handler(req, res) {
  const { method, body, query } = req;

  await connectToDatabase();

  switch (method) {
    case 'GET':
      return verifyToken(req, res, async () => {
        try {
          const { email } = req.user;
          const user = await User.findOne({ email });

          if (!user) {
            return res.status(404).json({ error: 'User not found' });
          }

          if (query.sales) {
            const today = timeZone().tz('Asia/Manila').startOf('day');
            const yesterday = timeZone(today).subtract(1, 'days');
            const tomorrow = timeZone(today).add(1, 'days');

            const transactionsToday = user.transactions.filter((transaction) => {
              const transactionDate = new Date(transaction.date);
              return transactionDate >= today && transactionDate < tomorrow;
            });

            const transactionsYesterday = user.transactions.filter((transaction) => {
              const transactionDate = new Date(transaction.date);
              return transactionDate >= yesterday && transactionDate < today;
            });

            const calculateTotalsByType = (transactions) => {
              const totals = { Cash: 0, Utang: 0, balance: 0 };

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

            const itemMap = new Map();

            user.transactions.forEach((transaction) => {
              transaction.items.forEach((item) => {
                if (itemMap.has(item.name)) {
                  itemMap.set(item.name, itemMap.get(item.name) + item.quantity);
                } else {
                  itemMap.set(item.name, item.quantity);
                }
              });
            });

            const top5Items = await getTopFastMovingItems(user.transactions);
            const top5ItemsWithQuantities = await getItemQuantities(top5Items, user.transactions);

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

          if (query.transactionType) {
            const transactionTypeRegex = new RegExp(query.transactionType, 'i');
            transactionsQuery.transactionType = transactionTypeRegex;
          }

          if (query.startDate && query.endDate) {
            const startDate = new Date(query.startDate);
            const endDate = new Date(query.endDate);
            endDate.setDate(endDate.getDate() + 1);

            transactionsQuery.createdAt = {
              $gte: startDate,
              $lt: endDate,
            };
          }

          const transactions = user.transactions.filter((transaction) => {
            let matches = true;
            if (transactionsQuery.transactionType) {
              matches =
                matches && transactionsQuery.transactionType.test(transaction.transactionType);
            }
            if (transactionsQuery.createdAt) {
              const transactionDate = new Date(transaction.date);
              matches =
                matches &&
                transactionDate >= transactionsQuery.createdAt.$gte &&
                transactionDate < transactionsQuery.createdAt.$lt;
            }
            return matches;
          });

          return res.status(200).json(transactions);
        } catch (error) {
          console.error('Error fetching transactions:', error);
          return res.status(500).json({ error: 'Failed to fetch transactions' });
        }
      });

    case 'POST':
      return verifyToken(req, res, async () => {
        const { items, personName, cash, total, partialAmount, type } = body;
        const { email } = req.user;

        const user = await User.findOne({ email });
        if (!user) {
          return res.status(404).json({ error: 'User not found' });
        }

        updateItem(req, email, res);
        const change = cash ? cash - total : undefined;
        const remainingBalance = partialAmount ? total - partialAmount : undefined;
        const returnTotal = total;
        const dataItems = {
          items: items,
        };

        if (type === 'Utang') {
          const utangResult = await addTransactionUtang(req);

          if (utangResult.success) {
            return res.status(200).json({
              success: true,
              message: 'Utang transaction created successfully',
              data: dataItems,
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
              message: 'Partial transaction created successfully',
              data: dataItems,
              total: total,
              change: total - partialAmount,
              partialAmount: partialAmount,
              remainingBalance,
            });
          } else {
            return res.status(500).json({ error: 'Failed to create partial transaction' });
          }
        }

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
            date: new Date(),
          };

          user.transactions.push(transactionData);
          await user.save();

          return res.status(201).json({
            data: items,
            total: returnTotal,
            remainingBalance: 0,
            change: cash - total,
          });
        }
      });

    default:
      return res
        .setHeader('Allow', ['GET', 'POST'])
        .status(405)
        .end(`Method ${method} Not Allowed`);
  }
}
