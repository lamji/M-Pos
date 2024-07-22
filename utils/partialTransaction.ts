// utils/helloworld.js
import Transaction from '../src/common/app/model/transaction';
import Utang from '../src/common/app/model/utang';

export const updatePartialTransactions = async (req: any) => {
  const { items, personName, cash, total, partialAmount, _id, payment } = req.body;
  let newTransaction, utangRecord, newTransactionUtang;

  try {
    if (_id) {
      console.log('test 2', _id);
      utangRecord = await Utang.findById(_id);
      if (!utangRecord) {
        return { status: 'error', message: 'Utang person name not found' };
      }

      // Update the existing utang record
      const utangItems = items.map((item: any) => ({
        ...item,
        name: 'Resto',
        price: total - partialAmount,
        quantity: 1,
      }));
      utangRecord.total += total - partialAmount;
      utangRecord.items = [...utangRecord.items, ...utangItems];
      utangRecord.transactions.push({ date: new Date(), amount: partialAmount });
      utangRecord.transactionType = 'Utang';

      const utangSaveResult = await utangRecord.save();
      if (!utangSaveResult) {
        return { success: false, status: 'error', message: 'Failed to save updated utang record' };
      }
    } else {
      // Create a new utang record
      const utangToAdd = total - partialAmount;
      utangRecord = new Utang({
        items,
        personName,
        total,
        remainingBalance: utangToAdd,
        transactions: payment ? [{ date: new Date(), amount: payment.amount }] : [],
      });

      const utangSaveResult = await utangRecord.save();
      if (!utangSaveResult) {
        return { success: false, status: 'error', message: 'Failed to save new utang record' };
      }
    }

    // Create the new transaction record for the partial payment
    const utangItemsCash = [
      {
        id: '4800361413480-35-resto',
        name: `Partial payment ${personName}`,
        quantity: 1,
        price: partialAmount,
      },
    ];
    const transactionData = {
      items: utangItemsCash,
      personName,
      cash,
      total: partialAmount,
      remainingBalance: utangRecord.remainingBalance,
      partialAmount,
      change: cash - partialAmount >= 0 ? cash - partialAmount : 0,
      transactionType: 'Cash',
    };

    const utangItems = [
      {
        id: '4800361413480-35-resto',
        name: `Resto ${personName}`,
        quantity: 1,
        price: total - partialAmount,
      },
    ];

    const transactionDataUtang = {
      items: utangItems,
      personName,
      cash,
      total: total - partialAmount,
      remainingBalance: utangRecord.remainingBalance,
      partialAmount,
      change: cash - partialAmount >= 0 ? cash - partialAmount : 0,
      transactionType: 'Utang',
    };

    newTransaction = new Transaction(transactionData);
    newTransactionUtang = new Transaction(transactionDataUtang);
    const transactionSaveResult = await newTransaction.save();
    const newTransactionUtangResult = await newTransactionUtang.save();
    if (!transactionSaveResult) {
      return { success: false, status: 'error', message: 'Failed to save new transaction record' };
    }
    if (!newTransactionUtangResult) {
      return {
        success: false,
        status: 'error',
        message: 'Failed to save new transaction utang record',
      };
    }

    return {
      success: true,
      status: 'success',
      data: newTransaction,
      remainingBalance: utangRecord.remainingBalance,
      partialAmount: partialAmount,
    };
  } catch (error) {
    console.error('Error creating partial transaction:', error);
    return { success: false, status: 'error', message: 'Failed to create partial transaction' };
  }
};
