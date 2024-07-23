import Transaction from '../src/common/app/model/transaction';
import Utang from '../src/common/app/model/utang';

export const addTransactionUtang = async (req: any) => {
  const { items, personName, cash, total, type, _id } = req.body;

  try {
    if (_id) {
      const utangRecord = await Utang.findById(_id);
      if (!utangRecord) {
        return { success: false, error: 'Utang record not found' };
      }

      console.log(items);

      utangRecord.items.push(...items);
      utangRecord.total += total;
      utangRecord.date = new Date();
      await utangRecord.save();

      const newTransaction = new Transaction({
        items,
        personName,
        cash,
        total,
        remainingBalance: 0,
        transactionType: type,
      });
      await newTransaction.save();

      return {
        success: true,
        data: newTransaction,
      };
    } else {
      const newUtangRecord = new Utang({
        items,
        personName,
        total,
        remainingBalance: total,
        transactions: [],
        date: new Date(),
      });
      await newUtangRecord.save();

      const newTransaction = new Transaction({
        items,
        personName,
        cash,
        total,
        remainingBalance: 0,
        transactionType: type,
      });
      await newTransaction.save();

      return {
        success: true,
        data: newTransaction,
      };
    }
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Failed to create or update transaction' };
  }
};
