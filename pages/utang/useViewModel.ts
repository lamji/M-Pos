import { getAllUtang, getUtangById, postTransaction } from '@/src/common/api/testApi';
import { setIsBackDropOpen } from '@/src/common/reducers/items';
import {
  getUtangData,
  setPayment,
  setUtangData,
  setUtangTotal,
} from '@/src/common/reducers/utangData';
import { useFormik } from 'formik';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import { Transaction } from '.';

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
  const [transactions, setTransactions] = useState<any>([]);
  const [open, setOpen] = useState(false);
  const [selectedData, setSelectedData] = useState<Transaction | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [type, setType] = useState('');
  const [refresh, setRefresh] = useState(false);
  const handleOpen = (row: Transaction) => {
    setSelectedData(row);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedData(null);
  };

  const handleChange = async (event: any, value: any) => {
    setIsLoading(true);
    try {
      const data = await getUtangById(value?._id);
      if (data) {
        setTransactions(data);
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
            id: '480036-adjustMent',
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
      try {
        const data = await postTransaction(transactionData);
        if (data) {
          resetForm();
          dispatch(setIsBackDropOpen(false));
          setType('');
          setRefresh(!refresh);
          handleClose();
        }
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

  const updateUtang = async () => {
    try {
      const data = await getAllUtang();
      if (data) {
        dispatch(setUtangData(data));
        dispatch(setUtangTotal(100 as any));
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    updateUtang();
  }, []);

  return {
    state,
    hanndlePayment,
    handleAdjustMent,
    formikUtang,
    handleChange,
    open,
    handleOpen,
    transactions,
    type,
    isLoading,
    handleClose,
    selectedData,
  };
}
