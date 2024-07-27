import User from '../src/common/app/model/Users';

export const addTransactionUtang = async (req: any) => {
  const { items, personName, total, type, _id, cash } = req.body;
  const { email } = req.user;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return { success: false, error: 'User not found' };
    }

    let utangRecord;

    // Check if _id is provided and find the utang record if it exists
    if (_id) {
      utangRecord = user.utangs.find((utang: any) => utang._id.toString() === _id);
      if (!utangRecord) {
        return { success: false, error: 'Utang record not found' };
      }

      // Update existing utang record
      utangRecord.items.push(...items);
      utangRecord.total += total;
      utangRecord.date = new Date();

      user.markModified('utangs');
    } else {
      // Create new utang record
      utangRecord = {
        items,
        personName,
        total,
        remainingBalance: total,
        transactionType: type,
        date: new Date(),
      };

      user.utangs.push(utangRecord);
      user.markModified('utangs');
    }

    // Create a new transaction record
    const newTransaction = {
      items,
      personName,
      cash,
      total,
      remainingBalance: 0,
      transactionType: type,
    };
    user.transactions.push(newTransaction);
    user.markModified('transactions');

    await user.save();

    return {
      success: true,
      data: utangRecord,
    };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Failed to create or update transaction' };
  }
};
