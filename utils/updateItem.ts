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

    // Loop through the items to update
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
    await user.save();
    return { status: 'success' };
  } catch (error) {
    console.error('Error updating items:', error);
    return { status: 'error', message: error || 'Error updating items' };
  }
};

export const getTopFastMovingItems = async (userTransactions: any, items: any[]) => {
  // Get the current date
  const now = new Date();

  // Calculate the start of the current week (Monday)
  const startOfWeek = new Date(now);
  const dayOfWeek = startOfWeek.getDay(); // 0 is Sunday, 1 is Monday, etc.
  const diffToMonday = (dayOfWeek + 6) % 7; // Number of days from Monday
  startOfWeek.setDate(startOfWeek.getDate() - diffToMonday);
  startOfWeek.setHours(0, 0, 0, 0); // Set time to midnight

  // Calculate the end of the current week (Sunday)
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999); // Set time to end of day

  // Filter transactions within the current week (Monday to Sunday)
  const transactionsThisWeek = userTransactions.filter((transaction: any) => {
    const transactionDate = new Date(transaction.date);
    return transactionDate >= startOfWeek && transactionDate <= endOfWeek;
  });

  // Aggregate items and calculate their total quantities
  const itemMap = new Map();

  transactionsThisWeek.forEach((transaction: any) => {
    transaction.items.forEach((itemIn: any) => {
      const itemFound = items.find((item: any) => item.id === itemIn.id);
      if (itemFound) {
        if (itemMap.has(itemIn.id)) {
          const currentData = itemMap.get(itemIn.id);
          itemMap.set(itemIn.id, {
            name: itemIn.name,
            quantity: currentData.quantity + itemIn.quantity,
            stock: itemFound.quantity,
          });
        } else {
          itemMap.set(itemIn.id, {
            name: itemIn.name,
            quantity: itemIn.quantity,
            stock: itemFound.quantity,
          });
        }
      }
    });
  });

  // Convert map to array and sort by quantity in descending order
  const sortedItems = Array.from(itemMap.values()).sort((a, b) => b.quantity - a.quantity);

  // Get top 20 fast-moving items with their names, quantities, and stock
  const top20Items = sortedItems.slice(0, 20);

  return top20Items;
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
