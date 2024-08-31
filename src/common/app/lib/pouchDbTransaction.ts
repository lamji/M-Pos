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
        fields: ['id', 'quantity'],
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
  const currentWeekStart = new Date(now.setDate(now.getDate() - now.getDay() + 1 + weekOffset * 7)); // Monday
  const currentWeekEnd = new Date(now.setDate(now.getDate() - now.getDay() + 7 + weekOffset * 7)); // Sunday

  return {
    start: new Date(currentWeekStart.setHours(0, 0, 0, 0)),
    end: new Date(currentWeekEnd.setHours(23, 59, 59, 999)),
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
    };
  } catch (err) {
    console.error('Error creating document', err);
    throw err;
  }
};

// Read all documents
export const readAllDocumentTransaction = async (): Promise<any[]> => {
  try {
    const result = await dbTransactions.allDocs({ include_docs: true });
    return result.rows.map((row) => row.doc as any);
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
