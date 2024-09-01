import PouchDB from 'pouchdb';

import PouchDBFind from 'pouchdb-find';

PouchDB.plugin(PouchDBFind);

// Initialize the PouchDB database
const db = new PouchDB<any>('my_database_my_items');

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

export const updateItemsQty = async (doc: any): Promise<any> => {
  console.log('docs================>', doc);
  try {
    // Step 1: Retrieve all items by their IDs using the index
    const result = await db.find({
      selector: {
        id: { $in: doc.items.map((item: any) => item.id) },
      },
      fields: ['id', 'quantity', '_rev', '_id', 'name', 'price', 'stocks'], // Retrieve only the necessary fields
    });

    // Step 2: Deduct the quantity from the existing items
    const itemsToUpdate = await Promise.all(
      result.docs.map(async (existingItem: any) => {
        const itemToUpdate = doc.items.find((item: any) => item.id === existingItem.id);
        const newQuantity = existingItem.quantity - itemToUpdate.quantity;
        // console.log('newDocs', itemToUpdate, existingItem);

        if (newQuantity < 0) {
          throw new Error(`Insufficient quantity for item ${existingItem.id}`);
        }

        return {
          ...existingItem,
          quantity: newQuantity,
        };
      })
    );

    // Step 3: Update the quantities of the items in the database
    await Promise.all(
      itemsToUpdate.map(async (item: any) => {
        await db.put({
          ...item,
          _rev: item._rev, // Ensure the correct revision is used
        });
      })
    );
  } catch (err) {
    console.error('Error creating or updating transaction', err);
    throw err;
  }
};

// Create a document
export const createDocument = async (doc: any): Promise<any> => {
  try {
    await db.put(doc);
    return doc as any;
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

    // Filter out documents with the specific language value
    const filteredDocs = result.rows
      .map((row) => row.doc as any)
      .filter((doc) => doc.language !== 'query') // Exclude documents where language is "query"
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // Sort by date

    return filteredDocs;
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

export async function checkIfIdExists(id: string): Promise<boolean> {
  try {
    await db.get(id); // Try to get the document by ID
    return true; // If no error, the document exists
  } catch (error: any) {
    if (error.status === 404) {
      return false; // Document not found
    } else {
      throw error; // Throw other unexpected errors
    }
  }
}

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
