import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setIsBackDropOpen } from '../reducers/items';
import apiClient from '../app/axios';
import { restoreDocument } from '../app/lib/pouchdbServiceItems';
import { restoreUtangDocument } from '../app/lib/pouchDbUtang';
import { restoreTransactionDocs } from '../app/lib/pouchDbTransaction';

// Define the types if needed
type UserData = {
  items: any[];
  utangs: any[];
  transactions: any[];
};

const useFetchItems = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchItems = async () => {
    setLoading(true);
    dispatch(setIsBackDropOpen(true)); // Show loading backdrop
    setError(null); // Clear any previous errors

    try {
      const response = await apiClient.get('/restore');

      const data = response.data;
      const userData: UserData = data.users[0] || {};

      const itemsData = userData.items || [];
      const utangsData = userData.utangs || [];
      const transactionsData = userData.transactions || [];

      if (data.success) {
        // Create an array of promises for restoring documents
        const restoreItemPromises = itemsData.map(async (data) => await restoreDocument(data));
        const restoreUtangPromises = utangsData.map(
          async (data) => await restoreUtangDocument(data)
        );
        const restoreTransactionsPromises = transactionsData.map(
          async (data) => await restoreTransactionDocs(data)
        );

        // Wait for all restore operations to complete
        await Promise.all([
          ...restoreItemPromises,
          ...restoreUtangPromises,
          ...restoreTransactionsPromises,
        ]);
      }
    } catch (error: any) {
      console.error('Error fetching items:', error);
      setError(error.message || 'An error occurred while fetching items');
      alert(JSON.stringify(error));
    } finally {
      // Close the backdrop and set loading state to false
      dispatch(setIsBackDropOpen(false));
      setLoading(false);
    }
  };

  return { loading, error, fetchItems };
};

export default useFetchItems;
