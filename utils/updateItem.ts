// utils/helloworld.js
import Item from '../src/common/app/model/Item';
import Transaction from '../src/common/app/model/transaction';

export const updateItem = async (req: any) => {
  try {
    // Mock data; replace this with actual data fetching logic if needed
    const { items } = req.body;

    for (const item of items) {
      const { id, quantity } = item;

      // Check if quantity is a valid number

      const existingItem = await Item.findOne({ id });
      if (existingItem) {
        if (isNaN(existingItem.quantity)) {
          console.log(`Invalid quantity for item ${id}: ${quantity}`);
          continue;
        } else {
          existingItem.quantity -= quantity;
        }
        await existingItem.save();
        console.log(`Updated item ${id}: new quantity is ${existingItem.quantity}`);
      } else {
        console.log(`Item with id ${id} not found`);
      }
    }

    return { status: 'success' };
  } catch (error) {
    console.error('Error updating items:', error);
    return { status: 'error', message: error };
  }
};

export const getTopFastMovingItems = async () => {
  // Calculate the date one week ago from today
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  // Retrieve all transactions within the last week
  const allTransactions = await Transaction.find({
    date: { $gte: oneWeekAgo },
  });

  // Aggregate items and calculate their total quantities
  const itemMap = new Map();

  allTransactions.forEach((transaction: any) => {
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

export const getItemQuantities = async (top5Items: any) => {
  // Extract item names from top5Items
  const itemNames = top5Items.map((item: any) => item.name);

  // Retrieve items from the Item collection based on item names
  const items = await Item.find({ name: { $in: itemNames } }).select('name _id quantity');

  // Create a map to easily access quantities by item name
  const itemQuantityMap = new Map();
  items.forEach((item) => {
    itemQuantityMap.set(item.name, { _id: item._id, quantity: item.quantity || 0 });
  });

  // Update top5Items with the quantities from the database
  return top5Items.map((item: any) => {
    const sold = item.quantity;
    return {
      ...item,
      ...itemQuantityMap.get(item.name),
      sold,
    };
  });
};
