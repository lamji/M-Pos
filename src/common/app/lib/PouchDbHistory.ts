import PouchDB from 'pouchdb';

// Initialize the PouchDB database
const dbHistory = new PouchDB<any>('my_database_history');
// const dbUtang = new PouchDB<any>('my_database_utang');

// Create a document
export const createDocumentHistory = async (doc: Document): Promise<void> => {
  try {
    await dbHistory.put(doc);
  } catch (err) {
    console.error('Error creating document', err);
    throw err;
  }
};

// Read all documents
export const readAllDocumentsHistory = async (): Promise<any[]> => {
  try {
    const result = await dbHistory.allDocs({ include_docs: true });
    return result.rows.map((row) => row.doc as any);
  } catch (err) {
    console.error('Error reading documents', err);
    throw err;
  }
};

// export const restoreUtangDocument = async (doc: any): Promise<void> => {
//   try {
//     // Fetch the existing document to get its _rev
//     const existingDoc = await dbHistory.get(doc._id).catch(() => null);

//     if (existingDoc) {
//       // If the document exists, replace it with the new data
//       await dbHistory.put({
//         ...doc,
//         _rev: existingDoc._rev, // Ensure the revision is correct
//       });
//     } else {
//       // If the document does not exist, create a new one
//       await dbHistory.put(doc);
//     }

//     console.log('Document created or replaced successfully');
//   } catch (err) {
//     console.error('Error creating or replacing document', err);
//     throw err;
//   }
// };
