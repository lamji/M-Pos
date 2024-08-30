import PouchDB from 'pouchdb';

import PouchDBFind from 'pouchdb-find';

PouchDB.plugin(PouchDBFind);

// Initialize the PouchDB database
const db = new PouchDB<any>('my_database_items');

export const queryDocumentsByBarcode = async (barcode: string): Promise<any[]> => {
  try {
    // Create an index on the `barcode` field if not already created
    await db.createIndex({
      index: { fields: ['barcode'] },
    });

    // Query the documents by barcode
    const result = await db.find({
      selector: { barcode: barcode },
    });

    return result.docs;
  } catch (err) {
    console.error('Error querying documents', err);
    throw err;
  }
};

// Create a document
export const createDocument = async (doc: any): Promise<void> => {
  try {
    await db.put(doc);
  } catch (err) {
    console.error('Error creating document', err);
    throw err;
  }
};

export const restoreDocument = async (doc: any): Promise<void> => {
  try {
    // Fetch the existing document to get its _rev
    const existingDoc = await db.get(doc._id).catch(() => null);

    if (existingDoc) {
      // If the document exists, replace it with the new data
      await db.put({
        ...doc,
        _rev: existingDoc._rev, // Ensure the revision is correct
      });
    } else {
      // If the document does not exist, create a new one
      await db.put(doc);
    }

    console.log('Document created or replaced successfully');
  } catch (err) {
    console.error('Error creating or replacing document', err);
    throw err;
  }
};

// Read all documents
export const readAllDocuments = async (): Promise<any[]> => {
  try {
    const result = await db.allDocs({ include_docs: true });

    // Extract documents and sort them by date (assuming the date is stored in a 'date' field)
    const sortedDocs = result.rows
      .map((row) => row.doc as any)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return sortedDocs;
  } catch (err) {
    console.error('Error reading documents', err);
    throw err;
  }
};

// Update a document
export const updateDocument = async (doc: any): Promise<void> => {
  try {
    // Fetch the existing document from the database
    const existingDoc = await db.get(doc._id);

    // Update the document based on its type
    const updatedDoc = { ...existingDoc, ...doc };

    if (doc.type !== 'New') {
      updatedDoc.quantity = (existingDoc.quantity || 0) + (doc.quantity || 0);
    }

    // Save the updated document
    await db.put({
      ...updatedDoc,
      _id: existingDoc._id,
      _rev: existingDoc._rev, // Include the revision ID for update
    });

    console.log('Document updated successfully');
  } catch (err) {
    console.error('Error updating document', err);
    throw err;
  }
};

// Delete a document
export const deleteDocument = async (id: string): Promise<void> => {
  try {
    const doc = await db.get(id);
    await db.remove(doc);
  } catch (err) {
    console.error('Error deleting document', err);
    throw err;
  }
};

// Deduct quantity from a document
export const deductQuantity = async (id: string, quantityToDeduct: number): Promise<void> => {
  try {
    // Fetch the existing document from the database using its _id
    const existingDoc = await db.get(id);

    if (!existingDoc) {
      throw new Error(`Document with ID ${id} not found`);
    }

    // Calculate the new quantity
    const newQuantity = (existingDoc.quantity || 0) - quantityToDeduct;

    if (newQuantity < 0) {
      throw new Error('Quantity cannot be negative');
    }

    // Update the document with the new quantity
    await db.put({
      ...existingDoc,
      quantity: newQuantity,
      _rev: existingDoc._rev, // Include the revision ID for update
    });

    console.log('Quantity deducted successfully');
  } catch (err) {
    console.error('Error deducting quantity', err);
    throw err;
  }
};
