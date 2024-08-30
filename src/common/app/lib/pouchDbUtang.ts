import PouchDB from 'pouchdb';

// Initialize the PouchDB database
const dbUtang = new PouchDB<any>('my_database_utang');
// const dbUtang = new PouchDB<any>('my_database_utang');

// Create a document
export const createDocumentUtang = async (doc: any): Promise<void> => {
  try {
    await dbUtang.put(doc);
  } catch (err) {
    console.error('Error creating document', err);
    throw err;
  }
};

export const updateUtang = async (doc: any): Promise<any> => {
  try {
    const newItems = doc.items.map((item: any) => {
      return {
        ...item,
        date: new Date(),
      };
    });

    let updatedDoc;

    // Find the document by _id
    const existingDoc = await dbUtang.get(doc._id);
    if (existingDoc) {
      // Update the document with the new total and prepend new items
      existingDoc.items.push(...newItems);
      existingDoc.total += doc.total;
      existingDoc.date = new Date();
      console.log('existingDoc===============', existingDoc);
      // Save the updated document
      await dbUtang.put(existingDoc);
      updatedDoc = existingDoc;
    } else {
      // If the document does not exist, create a new one
      await dbUtang.put(doc);
      updatedDoc = doc;
    }

    return {
      ...updatedDoc,
      data: newItems,
      type: doc.type,
    }; // Return the updated document
  } catch (err) {
    console.error('Error updating document', err);
    throw err;
  }
};

// Read all documents
export const readAllDocumentsUtang = async (): Promise<any[]> => {
  try {
    const result = await dbUtang.allDocs({ include_docs: true });

    const filteredDocs = result.rows
      .map((row) => row.doc as any)
      .filter((doc) => {
        // Calculate the total for each document
        const total = doc.items.reduce((acc: number, item: any) => {
          return acc + item.price * item.quantity;
        }, 0);

        // Return only documents where the total is greater than 0
        return total > 0;
      });

    return filteredDocs;
  } catch (err) {
    console.error('Error reading documents', err);
    throw err;
  }
};

// Read documents by partial match on personName (case-sensitive)
export const readDocsByPersonName = async (searchTerm: string): Promise<any[]> => {
  try {
    const result = await dbUtang.allDocs({ include_docs: true });
    const regex = new RegExp(searchTerm, 'i'); // Case-sensitive search

    const filteredDocs = result.rows
      .map((row) => row.doc as any)
      .filter((doc) => regex.test(doc.personName)); // Filter by regex

    return filteredDocs;
  } catch (err) {
    console.error('Error reading documents by personName', err);
    throw err;
  }
};

export const restoreUtangDocument = async (doc: any): Promise<void> => {
  try {
    // Fetch the existing document to get its _rev
    const existingDoc = await dbUtang.get(doc._id).catch(() => null);

    if (existingDoc) {
      // If the document exists, replace it with the new data
      await dbUtang.put({
        ...doc,
        _rev: existingDoc._rev, // Ensure the revision is correct
      });
    } else {
      // If the document does not exist, create a new one
      await dbUtang.put(doc);
    }

    console.log('Document created or replaced successfully');
  } catch (err) {
    console.error('Error creating or replacing document', err);
    throw err;
  }
};

// Delete all documents
export const deleteAllUtangDocuments = async (): Promise<void> => {
  try {
    const result = await dbUtang.allDocs({ include_docs: true });

    // Collect all documents for deletion
    const deletionPromises = result.rows.map(async (row) => {
      const doc = row.doc as any;
      return dbUtang.remove(doc._id, doc._rev);
    });

    // Wait for all deletions to complete
    await Promise.all(deletionPromises);

    console.log('All documents deleted successfully');
  } catch (err) {
    console.error('Error deleting documents', err);
    throw err;
  }
};
