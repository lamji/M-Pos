import { setIsBackDropOpen } from '@/src/common/reducers/items';
import { getUtangData, setPayment } from '@/src/common/reducers/utangData';
import { useFormik } from 'formik';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import { Transaction } from '.';
import {
  readAllDocumentsUtang,
  readDocsByPersonName,
  updateUtang,
} from '@/src/common/app/lib/pouchDbUtang'; // Import the readDocById function
import { getData } from '@/src/common/reducers/data';
import { createDocumentTransaction } from '@/src/common/app/lib/pouchDbTransaction';

const validationSchema = Yup.object({
  description: Yup.string()
    .required('Description is required')
    .min(2, 'Description should be at least 2 characters')
    .max(50, 'Description should be 50 characters or less'),
  amount: Yup.number()
    .required('Amount is required')
    .positive('Amount must be a positive number')
    .integer('Amount must be an integer'),
});

export default function useViewModel() {
  const router = useRouter();
  const dispatch = useDispatch();
  const state = useSelector(getUtangData);
  const utangState = useSelector(getData);
  const [transactions, setTransactions] = useState<any>([]);
  const [utangList, setUtangList] = useState<any>([]);
  const [open, setOpen] = useState(false);
  const [selectedData, setSelectedData] = useState<Transaction | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [type, setType] = useState('');
  const [refresh, setRefresh] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [grandTotal, setGrandTotal] = useState(0);

  const handleOpen = (row: Transaction) => {
    setSelectedData(row);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedData(null);
  };

  const handleSearchChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    setSearchTerm(event.target.value);
    setIsLoading(true);
    try {
      const data = await readDocsByPersonName(event.target.value); // Use readDocById to fetch the document by ID
      if (data) {
        setUtangList(data);
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const formikUtang = useFormik({
    initialValues: {
      description: '',
      amount: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { resetForm }) => {
      dispatch(setIsBackDropOpen(true));
      const transactionData = {
        type: 'Utang',
        items: [
          {
            id: new Date(),
            name: values?.description,
            price: values?.amount,
            quantity: 1,
          },
        ],
        personName: selectedData?.personName,
        total: values.amount,
        _id: selectedData?._id || undefined,
        forAdj: 'adjustment',
      };

      const transactionDataDocs = {
        type: 'Utang',
        items: [
          {
            id: new Date(),
            name: values?.description,
            price: values?.amount,
            quantity: 1,
          },
        ],
        personName: selectedData?.personName,
        total: values.amount,
        _id: new Date() || undefined,
        forAdj: 'adjustment',
      };
      try {
        await Promise.all([
          updateUtang(transactionData),
          createDocumentTransaction(transactionDataDocs),
        ]);
        resetForm();
        dispatch(setIsBackDropOpen(false));
        setType('');
        setRefresh(!refresh);
        handleClose();
      } catch (error) {
        alert(JSON.stringify(error));
        console.error('Error:', error);
        setIsLoading(false);
        dispatch(setIsBackDropOpen(false));
        handleClose();
      }
    },
  });

  const handleAdjustMent = () => {
    setType('adjustment');
  };

  const hanndlePayment = () => {
    const props = {
      name: selectedData?.personName, // Payor's name
      amount: selectedData?.total, // Payment amount
      id: selectedData?._id,
    };
    dispatch(setPayment(props as any));
    router.push('/payment');
  };

  useEffect(() => {
    setTransactions(state);
  }, [state]);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const docs = await readAllDocumentsUtang();
        setUtangList(docs);

        // Calculate the grand total once
        const total = docs.reduce((acc, transaction) => {
          const totalForTransaction = transaction.items.reduce((itemAcc: any, item: any) => {
            return itemAcc + item.price * item.quantity;
          }, 0);
          return acc + totalForTransaction;
        }, 0);

        setGrandTotal(total);
      } catch (err) {
        console.error('Error fetching documents', err);
      }
    };

    fetchDocuments();
  }, [utangState.isRefetch, refresh]);

  return {
    state,
    hanndlePayment,
    handleAdjustMent,
    formikUtang,
    open,
    handleOpen,
    transactions,
    type,
    isLoading,
    handleClose,
    selectedData,
    utangList,
    handleSearchChange,
    searchTerm,
    grandTotal,
  };
}
