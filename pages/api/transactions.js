/* eslint-disable no-self-assign */
/* eslint-disable no-const-assign */
// // pages/api/transactions.js
// import { connectToDatabase } from '../../src/common/app/lib/mongodb';
// import Transaction from '../../src/common/app/model/transaction';

// export default async function handler(req, res) {
//   const { method, query } = req;

//   await connectToDatabase();

//   switch (method) {
//     case 'GET':
//       try {
//         // Handle filtering by transactionType in a case-insensitive manner
//         if (query.transactionType) {
//           const transactionTypeRegex = new RegExp(query.transactionType, 'i');
//           const transactions = await Transaction.find({ transactionType: transactionTypeRegex });
//           return res.status(200).json(transactions);
//         }

//         // If no transactionType filter is provided, return all transactions
//         const transactions = await Transaction.find({});
//         res.status(200).json(transactions);
//       } catch (error) {
//         console.error('Error fetching transactions:', error); // Log the error
//         res.status(500).json({ error: 'Failed to fetch transactions' });
//       }
//       break;

//     case 'POST':
//       try {
//         const { items, personName, cash, total, partialAmount, type } = req.body;

//         // Calculate remaining balance and change
//         const change = cash ? cash - total : undefined;
//         const remainingBalance = partialAmount ? total - partialAmount : undefined;

//         const transactionData = {
//           items,
//           personName,
//           cash,
//           total,
//           remainingBalance,
//           partialAmount,
//           change,
//           transactionType: type,
//         };

//         const newTransaction = new Transaction(transactionData);
//         await newTransaction.save();

//         console.log(transactionData, newTransaction);

//         res.status(201).json(newTransaction);
//       } catch (error) {
//         console.log(error);
//         res.status(500).json({ error: 'Failed to add transaction' });
//       }
//       break;

//     default:
//       res.setHeader('Allow', ['POST']);
//       res.status(405).end(`Method ${method} Not Allowed`);
//   }
// }
/* eslint-disable no-const-assign */
import { connectToDatabase } from '../../src/common/app/lib/mongodb';
import Transaction from '../../src/common/app/model/transaction';
import Utang from '../../src/common/app/model/utang';

export default async function handler(req, res) {
  const { method, body } = req;

  await connectToDatabase();

  switch (method) {
    case 'GET':
      try {
        // Handle filtering by transactionType in a case-insensitive manner
        if (body.transactionType) {
          const transactionTypeRegex = new RegExp(body.transactionType, 'i');
          const transactions = await Transaction.find({ transactionType: transactionTypeRegex });
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
        const { items, personName, cash, total, partialAmount, type, _id, payment } = body;

        // Calculate remaining balance and change
        const change = cash ? cash - total : undefined;
        const remainingBalance = partialAmount ? total - partialAmount : undefined;

        if (type === 'Utang') {
          // let utangRecord; // Rename from `utang` to `utangRecord`

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
            utangRecord.total = utangRecord.total; // This line is technically redundant but keeps the clarity
            utangRecord.remainingBalance = utangRecord.remainingBalance; // Ensure this is updated
            utangRecord.transactionType = type;

            // Save the updated 'utang' record
            await utangRecord.save();

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
            const response = {
              items: newTransaction.items,
              personName: newTransaction.personName,
              total: newTransaction.total,
              remainingBalance: newTransaction.remainingBalance,
              transactions: newTransaction.transactions,
              _id: newTransaction._id,
              __v: newTransaction.__v,
              transactionType: type,
            };

            res.status(201).json(response);
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

            const response = {
              items: newUtangRecord.items,
              personName: newUtangRecord.personName,
              total: newUtangRecord.total,
              remainingBalance: newUtangRecord.remainingBalance,
              transactions: newUtangRecord.transactions,
              _id: newUtangRecord._id,
              __v: newUtangRecord.__v,
              transactionType: type,
            };

            res.status(201).json(response);

            // _id = newUtangRecord._id; // Get the ID of the newly created 'utang' record
          }
        }

        if (type === 'partial') {
          if (_id) {
            // If _id is provided, it is an existing 'utang' record to update
            var utangRecordPartial = await Utang.findById(_id);
            if (!utangRecordPartial) {
              return res.status(404).json({ error: 'Utang person name not found' });
            }

            // Add the incoming items to the existing items array
            utangRecordPartial.items = [...utangRecordPartial.items, ...items];

            // Recalculate the total amount including the incoming items and the new total to add
            const newTotal = utangRecordPartial.items.reduce(
              (sum, item) => sum + item.price * item.quantity,
              0
            );
            const utangToAdd = total - partialAmount;
            utangRecordPartial.total = newTotal + utangToAdd; // Update total to include the new amount

            // Recalculate the remaining balance based on the new total and previous payments
            utangRecordPartial.remainingBalance =
              utangRecordPartial.total -
              utangRecordPartial.transactions.reduce(
                (sum, transaction) => sum + transaction.amount,
                0
              );

            // Update the personName, cash, transactionType fields
            utangRecordPartial.personName = personName;
            utangRecordPartial.cash = cash;
            utangRecordPartial.transactionType = type;

            // Save the updated 'utang' record
            await utangRecordPartial.save();

            // Create and save the new transaction record
            const transactionData = {
              items,
              personName,
              cash,
              total,
              remainingBalance: utangRecordPartial.remainingBalance, // Ensure this is updated
              partialAmount,
              change,
              transactionType: type,
            };

            const newTransaction = new Transaction(transactionData);
            await newTransaction.save();

            // Send the response
            const response = {
              items: newTransaction.items,
              personName: newTransaction.personName,
              total: newTransaction.total,
              remainingBalance: newTransaction.remainingBalance,
              transactions: newTransaction.transactions,
              _id: newTransaction._id,
              __v: newTransaction.__v,
              transactionType: type,
            };

            res.status(201).json(response);
          } else {
            // If _id is not provided, create a new 'utang' record

            // Calculate the `utangToAdd` and `total`
            const newTotal = total; // Total amount to pay
            const utangToAdd = total - partialAmount; // Amount to be added to the `utang`

            // Create a new `Utang` record
            const newUtang = new Utang({
              items,
              personName,
              cash,
              total: newTotal,
              remainingBalance: utangToAdd, // Set remaining balance to the amount to be added to `utang`
              partialAmount,
              change,
              transactionType: type,
            });

            // Save the new `Utang` record
            await newUtang.save();

            // Create and save the new transaction record
            const transactionData = {
              items,
              personName,
              cash,
              total: newTotal,
              remainingBalance: newUtang.remainingBalance,
              partialAmount,
              change,
              transactionType: type,
            };

            const newTransaction = new Transaction(transactionData);
            await newTransaction.save();

            // Send the response
            const response = {
              items: newTransaction.items,
              personName: newTransaction.personName,
              total: newTransaction.total,
              remainingBalance: newTransaction.remainingBalance,
              transactions: newTransaction.transactions,
              _id: newTransaction._id,
              __v: newTransaction.__v,
              transactionType: type,
            };

            res.status(201).json(response);
          }
        }

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

        res.status(201).json(newTransaction);
      } catch (error) {
        console.error('Error adding transaction:', error);
        res.status(500).json({ error: 'Failed to add transaction' });
      }
      break;

    default:
      res.setHeader('Allow', ['POST', 'GET']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
