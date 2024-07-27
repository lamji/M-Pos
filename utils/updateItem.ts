// utils/helloworld.js
import User from '../src/common/app/model/Users';

export const updateItem = async (req: any, email: string) => {
  try {
    const { items } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return { status: 'error', message: 'User not found' };
    }

    for (const item of items) {
      const { id, quantity } = item;

      // Check if quantity is a valid number
      if (isNaN(quantity)) {
        console.log(`Invalid quantity for item ${id}: ${quantity}`);
        continue;
      }

      // Find the existing item in the user's items
      const existingItem = user.items.find((userItem: any) => userItem.id === id);

      if (existingItem) {
        existingItem.quantity -= quantity;
        console.log(`Updated item ${id}: new quantity is ${existingItem.quantity}`);
      } else {
        console.log(`Item with id ${id} not found in user's items`);
      }
    }

    user.markModified('items');
    await user.save();

    return { status: 'success' };
  } catch (error) {
    console.error('Error updating items:', error);
    return { status: 'error', message: error };
  }
};

export const getTopFastMovingItems = async (userTransactions: any) => {
  // Calculate the date one week ago from today
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  // Filter transactions within the last week
  const transactionsLastWeek = userTransactions.filter((transaction: any) => {
    const transactionDate = new Date(transaction.date);
    return transactionDate >= oneWeekAgo;
  });

  // Aggregate items and calculate their total quantities
  const itemMap = new Map();

  transactionsLastWeek.forEach((transaction: any) => {
    transaction.items.forEach((item: any) => {
      if (itemMap.has(item.name)) {
        itemMap.set(item.name, itemMap.get(item.name) + item.quantity);
      } else {
        itemMap.set(item.name, item.quantity);
      }
    });
  });

  // Convert map to array and sort by quantity in descending order
  const sortedItems = Array.from(itemMap.entries()).sort((a, b) => b[1] - a[1]);

  // Get top 5 fast-moving items with their names and quantities
  const top5Items = sortedItems.slice(0, 20).map(([name, quantity]) => ({ name, quantity }));

  return top5Items;
};

export const getItemQuantities = async (top5Items: any, userTransactions: any) => {
  // Extract item names from top5Items
  const itemNames = top5Items.map((item: any) => item.name);

  // Retrieve items from the user's transactions based on item names
  const itemQuantityMap = new Map();

  userTransactions.forEach((transaction: any) => {
    transaction.items.forEach((item: any) => {
      if (itemNames.includes(item.name)) {
        if (!itemQuantityMap.has(item.name)) {
          itemQuantityMap.set(item.name, { _id: item._id, quantity: item.quantity || 0 });
        }
      }
    });
  });

  // Update top5Items with the quantities from the user's transactions
  return top5Items.map((item: any) => {
    const sold = item.quantity;
    return {
      ...item,
      ...itemQuantityMap.get(item.name),
      sold,
    };
  });
};
