import User from '../src/common/app/model/Users';

export const updatePartialTransactions = async (req: any) => {
  const { items, personName, cash, total, partialAmount, _id, payment } = req.body;
  let utangRecord;

  try {
    // Find the user based on email from the request
    const { email } = req.user;
    const user = await User.findOne({ email });
    if (!user) {
      return { success: false, status: 'error', message: 'User not found' };
    }

    if (_id) {
      // Update existing utang record
      utangRecord = user.utangs.find((utang: any) => utang._id.toString() === _id);
      if (!utangRecord) {
        return { success: false, status: 'error', message: 'Utang record not found' };
      }

      // Update utang record
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
    } else {
      // Create a new utang record
      const utangToAdd = total - partialAmount;
      utangRecord = {
        items,
        personName,
        total: utangToAdd,
        remainingBalance: utangToAdd,
        transactions: payment ? [{ date: new Date(), amount: payment.amount }] : [],
        date: new Date(),
      };
      user.utangs.push(utangRecord);
    }

    // Create a new transaction record inside the user schema
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

    user.transactions.push(transactionData);
    user.transactions.push(transactionDataUtang);

    await user.save();

    return {
      success: true,
      status: 'success',
      data: transactionData,
      remainingBalance: utangRecord.remainingBalance,
      partialAmount: partialAmount,
    };
  } catch (error) {
    console.error('Error creating partial transaction:', error);
    return { success: false, status: 'error', message: 'Failed to create partial transaction' };
  }
};
