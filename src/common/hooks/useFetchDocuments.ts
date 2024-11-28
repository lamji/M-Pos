import { useState } from 'react';
import { readAllDocuments } from '../app/lib/pouchdbServiceItems';
import { readAllDocumentsUtangA } from '../app/lib/pouchDbUtang';
import { readAllDocumentsTransactions } from '../app/lib/pouchDbTransaction';
import { setIsBackDropOpen } from '../reducers/items';
import { useDispatch } from 'react-redux';
import apiClient from '../app/axios';

const useFetchDocumentsBackup = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDocuments = async () => {
    setLoading(true);
    setError(null); // Clear previous errors

    try {
      dispatch(setIsBackDropOpen(true));
      const docs = await readAllDocuments();
      const utangData = await readAllDocumentsUtangA();
      const transactionsData = await readAllDocumentsTransactions();

      const payload = {
        items: docs,
        utangs: utangData.map((data) => {
          return {
            items: data.items,
            personName: data.personName,
            total: data.total,
            remainingBalance: data.remainingBalance,
            date: data.date,
            transactions: data.transactions,
            _id: data._id,
            _rev: data._rev,
          };
        }),
        transactions: transactionsData,
      };
      const res = await apiClient.post('/backup', payload);
      console.log('Backup Data:', { res });
    } catch (err: any) {
      console.error('Error fetching documents', err);
      setError(err.message || 'Failed to fetch documents');
    } finally {
      setLoading(false);
      dispatch(setIsBackDropOpen(false));
    }
  };

  return {
    loading,
    error,

    history,

    fetchDocuments, // Expose the function for manual triggering
  };
};

export default useFetchDocumentsBackup;
