/* eslint-disable @typescript-eslint/no-unused-vars */
import PouchDB from 'pouchdb';
import PouchDBFind from 'pouchdb-find';

PouchDB.plugin(PouchDBFind);
// Initialize the PouchDB database
const dbTransactions = new PouchDB<any>('my_database_transaction');
// const dbUtang = new PouchDB<any>('my_database_utang');

// Create index for `id` and `quantity` fields
const createIndexes = async () => {
  try {
    await dbTransactions.createIndex({
      index: {
        fields: ['id', 'quantity', 'type'],
      },
    });
    console.log('Indexes created successfully');
  } catch (err) {
    console.error('Error creating indexes', err);
  }
};

// Call createIndexes() during your app setup
createIndexes();

const getWeekDateRange = (weekOffset: number = 0): { start: Date; end: Date } => {
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

  return {
    start: new Date(startOfWeek.setHours(0, 0, 0, 0)),
    end: new Date(endOfWeek.setHours(23, 59, 59, 999)),
  };
};

const getDateRanges = (): {
  today: { start: Date; end: Date };
  yesterday: { start: Date; end: Date };
} => {
  const now = new Date();

  // Start and end of today
  const todayStart = new Date(now.setHours(0, 0, 0, 0));
  const todayEnd = new Date(now.setHours(23, 59, 59, 999));

  // Adjust for yesterday
  const yesterdayStart = new Date(todayStart);
  yesterdayStart.setDate(todayStart.getDate() - 1);
  const yesterdayEnd = new Date(todayEnd);
  yesterdayEnd.setDate(todayEnd.getDate() - 1);

  return {
    today: {
      start: todayStart,
      end: todayEnd,
    },
    yesterday: {
      start: yesterdayStart,
      end: yesterdayEnd,
    },
  };
};

export const findTop10FastMovingItemsThisWeek = async (weekOffset: number = 0): Promise<any[]> => {
  try {
    const { start, end } = getWeekDateRange(weekOffset);

    // Query documents within the date range
    const result = await dbTransactions.find({
      selector: {
        date: {
          $gte: start.toISOString(),
          $lte: end.toISOString(),
        },
      },
    });

    // Flatten the items array from all documents
    const allItems = result.docs.flatMap((doc: any) => doc.items || []);

    // Merge quantities by _id
    const itemsMap = allItems.reduce((acc: any, item: any) => {
      if (acc[item.id]) {
        acc[item.id].quantity += item.quantity;
      } else {
        acc[item.id] = { ...item };
      }
      return acc;
    }, {});

    // Convert the itemsMap back to an array
    const mergedItems = Object.values(itemsMap);

    // Sort merged items by quantity in descending order and take the top 10
    const top10Items = mergedItems
      .sort((a: any, b: any) => b.quantity - a.quantity) // Sort by quantity in descending order
      .slice(0, 10); // Take the top 10

    return top10Items;
  } catch (err) {
    console.error('Error finding top 10 fast-moving items this week', err);
    throw err;
  }
};

// Create a document
export const createDocumentTransaction = async (doc: any): Promise<{ data: any }> => {
  try {
    const newItems = doc.items.map((item: any) => {
      return {
        ...item,
        date: new Date(),
      };
    });

    const newDocs = {
      ...doc,
      items: newItems,
    };

    // Save the document to the database
    await dbTransactions.put(newDocs);

    // Return the saved document
    return {
      ...newDocs,
      data: newDocs.items,
      change: newDocs.cash - newDocs.total,
      remainingBalance: newDocs.total - newDocs?.partialAmount || 0,
      total: newDocs.total,
    };
  } catch (err) {
    console.error('Error creating document', err);
    throw err;
  }
};

// Read all documents
export const readAllDocumentTransaction = async (): Promise<{
  today: { docs: any[]; total: number; totalCash: number; totalUtang: number; items: any };
  yesterday: { docs: any[]; total: number; totalCash: number; totalUtang: number; items: any };
}> => {
  try {
    const { today, yesterday } = getDateRanges();

    // Fetch documents for today
    const todayResult = await dbTransactions.find({
      selector: {
        date: {
          $gte: today.start.toISOString(),
          $lte: today.end.toISOString(),
        },
      },
    });

    const test = await dbTransactions.allDocs({ include_docs: true });

    console.log('docs===============>', test, todayResult);

    // Fetch documents for yesterday
    const yesterdayResult = await dbTransactions.find({
      selector: {
        date: {
          $gte: yesterday.start.toISOString(),
          $lte: yesterday.end.toISOString(),
        },
      },
    });

    // Calculate totals for today
    const todayDocs = todayResult.docs;
    let todayTotalCash = 0;
    let todayTotalUtang = 0;

    todayDocs.forEach((doc) => {
      if (doc.type === 'Cash') {
        todayTotalCash += doc.total || 0;
      } else if (doc.type === 'Utang') {
        todayTotalUtang += doc.total || 0;
      }
    });

    const todayTotal = todayDocs.reduce((sum, doc) => sum + (doc.total || 0), 0);

    // Calculate totals for yesterday
    const yesterdayDocs = yesterdayResult.docs;
    let yesterdayTotalCash = 0;
    let yesterdayTotalUtang = 0;

    yesterdayDocs.forEach((doc) => {
      if (doc.type === 'Cash') {
        yesterdayTotalCash += doc.total || 0;
      } else if (doc.type === 'Utang') {
        yesterdayTotalUtang += doc.total || 0;
      }
    });

    const yesterdayTotal = yesterdayDocs.reduce((sum, doc) => sum + (doc.total || 0), 0);

    // Extract items and merge them into a single array
    const todayItems = todayDocs.flatMap((doc) => doc.items || []);
    const yesterdayItems = yesterdayDocs.flatMap((doc) => doc.items || []);
    // Sorting items by date in ascending order
    const sortedTodayItems = todayItems.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    const sortedYesterdayItems = yesterdayItems.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    return {
      today: {
        docs: todayDocs,
        total: todayTotal,
        totalCash: todayTotalCash,
        totalUtang: todayTotalUtang,
        items: sortedTodayItems,
      },
      yesterday: {
        items: sortedYesterdayItems,
        docs: yesterdayDocs,
        total: yesterdayTotal,
        totalCash: yesterdayTotalCash,
        totalUtang: yesterdayTotalUtang,
      },
    };
  } catch (err) {
    console.error('Error reading documents', err);
    throw err;
  }
};

export const restoreTransactionDocs = async (doc: any): Promise<void> => {
  try {
    // Fetch the existing document to get its _rev
    const existingDoc = await dbTransactions.get(doc._id).catch(() => null);

    if (existingDoc) {
      // If the document exists, replace it with the new data
      await dbTransactions.put({
        ...doc,
        _rev: existingDoc._rev, // Ensure the revision is correct
      });
    } else {
      // If the document does not exist, create a new one
      await dbTransactions.put(doc);
    }

    console.log('Document created or replaced successfully');
  } catch (err) {
    console.error('Error creating or replacing document', err);
    throw err;
  }
};
