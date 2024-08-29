import PouchDB from 'pouchdb';

// Initialize the PouchDB database
const dbTransactions = new PouchDB<any>('my_database_transaction');
// const dbUtang = new PouchDB<any>('my_database_utang');

// Create a document
export const createDocumentTransaction = async (doc: any): Promise<void> => {
  try {
    // Save each document in the array to the database

    await dbTransactions.put(doc);
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
