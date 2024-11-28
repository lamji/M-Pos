import { useEffect, useState } from 'react';
import { useStyles } from './useStyles';
import { useMediaQuery, useTheme } from '@mui/material';

import { useDispatch, useSelector } from 'react-redux';
import { clearItems, getSelectedItems, setIsBackDropOpen } from '@/src/common/reducers/items';
import { clearCookie, getCookie } from '@/src/common/app/cookie';
import { useDeviceType } from '@/src/common/helpers';
import hotkeys from 'hotkeys-js';
import { readAllDocumentsUtang, updateUtang } from '@/src/common/app/lib/pouchDbUtang';
import { CheckoutProps } from '.';
import { useRouter } from 'next/router';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { createDocumentTransaction } from '@/src/common/app/lib/pouchDbTransaction';
import { setRefetch } from '@/src/common/reducers/data';
import { updateItemsQty } from '@/src/common/app/lib/pouchdbServiceItems';
import {
  cashTransactionQty,
  cashUpdateQty,
  createTransactionPayload,
  partialQtyPayload,
  partialTransactionPayload,
  partialUtangPayload,
  updateQtyPayload,
  updateUtangPayload,
} from '@/src/common/helpers/payloadGenerator';

export default function useViewModel({ isRefresh }: CheckoutProps) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const { isMobile, isLaptop, isPC } = useDeviceType();
  const isLarge = isLaptop || isPC;
  const token = getCookie('t');
  const [refresh, setRefresh] = useState(false);
  const router = useRouter();
  const { total, items } = useSelector(getSelectedItems); // Get total from Redux

  const [selectedOption, setSelectedOption] = useState<'cash' | 'utang' | 'partial' | null>(null);
  const [receiptOpen, setReceiptOpen] = useState(false);
  const [allItems, setAllItems] = useState<any>([]);
  const [allItemsUtang, setAllItemsUtang] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [allUtangList, setAllUtangList] = useState<any>();
  const [isOld, setIsOld] = useState(true);

  const formikCash = useFormik({
    initialValues: {
      cashAmount: '',
    },
    validationSchema: Yup.object({
      cashAmount: Yup.number()
        .required('Required')
        .positive('Must be a positive number')
        .integer('Must be an integer')
        .min(total, 'Cash amount must be at least the amount to pay'), // Use total here
    }),
    onSubmit: async (values, { resetForm }) => {
      const cashAmount = Number(values.cashAmount);
      dispatch(setIsBackDropOpen(true));

      const payload = {
        type: 'Cash',
        items,
        cashAmount,
        total,
      };
      const transactionDataQty = cashUpdateQty(payload);
      const transactionData = cashTransactionQty(payload);
      setIsLoading(true);
      try {
        const [, updatedData] = await Promise.all([
          updateItemsQty(transactionDataQty),
          createDocumentTransaction(transactionData),
        ]);

        if (updatedData) {
          setAllItems(updatedData);
          handleClearItems();
          setReceiptOpen(true);
          handleClose();
          setIsLoading(false);
          resetForm();
          dispatch(setIsBackDropOpen(false));
          dispatch(setRefetch());
          setRefresh(!refresh);
          isRefresh(!refresh);
          // dispatch(setRefresh(!app));
        }
      } catch (error) {
        console.error('Error:', error);
        alert(JSON.stringify(error, null, 2));
        setIsLoading(false);
        dispatch(setIsBackDropOpen(false));
      }
    },
  });

  const formikUtang = useFormik({
    initialValues: {
      personName: '',
      _id: '',
    },
    validationSchema: Yup.object({
      personName: Yup.string()
        .required('Required')
        .min(2, 'Name is too short')
        .max(50, 'Name is too long'),
      _id: Yup.string().nullable(),
    }),
    onSubmit: async (values, { resetForm }) => {
      dispatch(setIsBackDropOpen(true));
      setIsLoading(true);

      const payload = { type: 'Utang', items, values, total };
      const transactionUtang = updateUtangPayload(payload);
      const transactionData = createTransactionPayload(payload);
      const qtyPayload = updateQtyPayload(payload);

      try {
        const [, transData] = await Promise.all([
          updateItemsQty(qtyPayload),
          createDocumentTransaction(transactionData),
          updateUtang(transactionUtang),
        ]);

        setAllItems(transData);
        setReceiptOpen(true);
        handleClose();
        handleClearItems();
        resetForm();
        setIsLoading(false);
        setIsOld(true);
        dispatch(setIsBackDropOpen(false));
        dispatch(setRefetch());
        isRefresh(!refresh);
      } catch (error) {
        alert(JSON.stringify(error, null, 2));
        setIsLoading(false);
        dispatch(setIsBackDropOpen(false));
      }
    },
  });

  const formikPartial = useFormik({
    initialValues: {
      partialAmount: '',
      desiredAmount: '',
      personName: '',
      _id: '',
    },
    validationSchema: Yup.object({
      partialAmount: Yup.number()
        .required('Required')
        .positive('Must be a positive number')
        .integer('Must be an integer')
        .min(0, 'Must be greater than or equal to 0'),
      desiredAmount: Yup.number()
        .required('Required')
        .positive('Must be a positive number')
        .integer('Must be an integer')
        .max(total, 'Cannot be more than amount to pay'), // Use total here
      personName: Yup.string()
        .required('Required')
        .min(2, 'Name is too short')
        .max(50, 'Name is too long'),
      _id: Yup.string().nullable(),
    }),
    onSubmit: async (values, { resetForm }) => {
      const partialAmount = Number(values.partialAmount); // cash
      const desiredAmount = Number(values.desiredAmount); // partial
      dispatch(setIsBackDropOpen(true));

      const payload = {
        type: 'Cash',
        items,
        values,
        partialAmount,
        desiredAmount,
        total,
      };

      const transactionData = partialTransactionPayload(payload);
      const qtyData = partialQtyPayload(payload);
      const transactionUtang = partialUtangPayload({
        type: 'Utang',
        total,
        desiredAmount,
        values,
        partialAmount,
        items,
      });

      setIsLoading(true);
      try {
        const [, transData, data] = await Promise.all([
          updateItemsQty(qtyData),
          createDocumentTransaction(transactionData),
          updateUtang(transactionUtang),
        ]);

        console.log('testData', transData, data);

        setAllItems(transData);
        if (data) {
          setIsLoading(false);
          handleClearItems();
          setReceiptOpen(true);
          resetForm();
          handleClose();
          dispatch(setIsBackDropOpen(false));
          dispatch(setRefetch());
          isRefresh(!refresh);
        }
      } catch (error) {
        alert(JSON.stringify(error, null, 2));
        console.error('Error:', error);
        dispatch(setIsBackDropOpen(false));
      }
    },
  });

  const handleOptionClick = (option: 'cash' | 'utang' | 'partial') => {
    setSelectedOption(option);
  };

  const handleProceedClick = () => {
    if (selectedOption === 'cash') {
      formikCash.handleSubmit();
    } else if (selectedOption === 'utang') {
      formikUtang.handleSubmit();
    } else if (selectedOption === 'partial') {
      console.log(formikPartial);
      formikPartial.handleSubmit();
    } else {
      handleClose();
    }
  };

  const getAllUtangData = async () => {
    try {
      const docs = await readAllDocumentsUtang();

      if (docs) {
        setAllItemsUtang(docs);
        // Get a list of all Utang names
        const listUtangName = docs.filteredDocs.map((item: any) => ({
          _id: item._id,
          personName: item.personName,
        }));
        setAllUtangList(listUtangName);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllUtangData();
  }, [refresh]);

  const handleSignout = async () => {
    clearCookie();
    router.push('/');
  };

  useEffect(() => {
    // Attach the hotkey event
    hotkeys('ctrl+p', (event, handler) => {
      // Prevent the default refresh event under WINDOWS system
      event.preventDefault();
      console.log(handler);
      handleClickOpen();
    });

    // Clear
    hotkeys('ctrl+c', (event) => {
      event.preventDefault();
      handleClearItems();
    });

    hotkeys('ctrl+l', (event) => {
      event.preventDefault();
      handleSignout();
    });

    // Cleanup the hotkey event on component unmount
    return () => {
      hotkeys.unbind('ctrl+p');
      hotkeys.unbind('ctrl+c');
      hotkeys.unbind('ctrl+l');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClearItems = () => {
    dispatch(clearItems());
  };

  const handleClose = () => {
    setOpen(false);
  };
  return {
    model: {
      fullScreen,
      open,
      token,
      isMobile,
      isLarge,
      receiptOpen,
      allItemsUtang,
      allItems,
      isLoading,
      allUtangList,
      isOld,
      total,
      selectedOption,
      formikCash,
      formikUtang,
      formikPartial,
    },
    actions: {
      handleClickOpen,
      handleClose,
      handleProceedClick,
      handleClearItems,
      handleOptionClick,
      setIsOld,
      setReceiptOpen,
    },
    classes,
  };
}
