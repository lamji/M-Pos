import React, { useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
  TextField,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import useViewModel from './useViewModel';

import { useSelector } from 'react-redux';
import { formatCurrency } from '@/src/common/helpers';
import { getSelectedItems } from '@/src/common/reducers/items';
import { postTransaction } from '@/src/common/api/testApi';
import moment from 'moment';

export default function Checkout() {
  const { total, items } = useSelector(getSelectedItems); // Get total from Redux
  const { classes, handleClickOpen, handleClose, open, fullScreen, handleClearItems } =
    useViewModel();
  const [selectedOption, setSelectedOption] = React.useState<'cash' | 'utang' | 'partial' | null>(
    null
  );
  const [receiptOpen, setReceiptOpen] = React.useState(false);
  const [allItems, setAllItems] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(false);

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

      const transactionData = {
        type: 'Cash',
        items: items,
        cash: cashAmount,
        total,
      };
      setIsLoading(true);
      try {
        const data = await postTransaction(transactionData);
        setAllItems(data.data);
        handleClearItems();
        setReceiptOpen(true);
        handleClose();
        setIsLoading(true);
        resetForm();
      } catch (error) {
        console.error('Error:', error);
      }
    },
  });

  const formikUtang = useFormik({
    initialValues: {
      personName: '',
    },
    validationSchema: Yup.object({
      personName: Yup.string()
        .required('Required')
        .min(2, 'Name is too short')
        .max(50, 'Name is too long'),
    }),
    onSubmit: async (values, { resetForm }) => {
      setIsLoading(true);
      const transactionData = {
        type: 'Utang',
        items: items,
        personName: values.personName,
        total,
      };
      try {
        const data = await postTransaction(transactionData);
        if (data) {
          setIsLoading(true);
          setAllItems(data.data);
          setReceiptOpen(true);
          handleClose();
          handleClearItems();
          resetForm();
        }
      } catch (error) {
        console.error('Error:', error);
      }
    },
  });

  const formikPartial = useFormik({
    initialValues: {
      partialAmount: '',
      desiredAmount: '',
      personName: '',
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
    }),
    onSubmit: async (values, { resetForm }) => {
      const partialAmount = Number(values.partialAmount);
      const desiredAmount = Number(values.desiredAmount);

      const transactionData = {
        type: 'partial',
        items: items,
        personName: values.personName,
        cash: partialAmount,
        total,
        partialAmount: desiredAmount,
      };
      setIsLoading(true);
      try {
        const data = await postTransaction(transactionData);
        setAllItems(data.data);
        if (data) {
          setIsLoading(false);
          handleClearItems();
          setReceiptOpen(true);
          resetForm();
          handleClose();
        }
      } catch (error) {
        console.error('Error:', error);
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
      formikPartial.handleSubmit();
    } else {
      handleClose();
    }
  };

  return (
    <div>
      <Box sx={classes.root}>
        <Typography fontWeight={700}>Total: {formatCurrency(total)}</Typography>{' '}
        {/* Use total here */}
        <Box>
          <Button sx={classes.button} onClick={handleClickOpen}>
            Check Out
          </Button>
        </Box>
      </Box>
      <div>
        <Dialog
          fullScreen={fullScreen}
          open={open}
          onClose={handleClose}
          aria-labelledby="responsive-dialog-title"
        >
          <DialogTitle>
            <Typography>Check Out</Typography>
            <IconButton
              onClick={handleClose}
              aria-label="close"
              sx={{ position: 'absolute', right: 8, top: 8 }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <Box p={2}>
              <Typography fontWeight={700} variant="h6">
                Amount To Pay
              </Typography>
              <Typography>{formatCurrency(total)}</Typography> {/* Use total here */}
            </Box>
            <Box px={2}>
              <Typography fontWeight={700} variant="h6">
                Select Option
              </Typography>
            </Box>
            <Box px={2}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleOptionClick('cash')}
                style={{ margin: '2px', ...classes.button2 }}
              >
                Cash
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => handleOptionClick('utang')}
                style={{ margin: '2px', ...classes.button2 }}
              >
                Utang
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={() => handleOptionClick('partial')}
                style={{ margin: '2px', ...classes.button2 }}
              >
                Partial
              </Button>
            </Box>

            <Box px={2}>
              {selectedOption === 'cash' && (
                <form onSubmit={formikCash.handleSubmit}>
                  <TextField
                    fullWidth
                    id="cashAmount"
                    name="cashAmount"
                    label="Input Cash"
                    value={formikCash.values.cashAmount}
                    onChange={formikCash.handleChange}
                    error={formikCash.touched.cashAmount && Boolean(formikCash.errors.cashAmount)}
                    helperText={formikCash.touched.cashAmount && formikCash.errors.cashAmount}
                    margin="normal"
                    type="number"
                  />
                </form>
              )}
              {selectedOption === 'utang' && (
                <form onSubmit={formikUtang.handleSubmit}>
                  <TextField
                    fullWidth
                    id="personName"
                    name="personName"
                    label="Input Person Name"
                    value={formikUtang.values.personName}
                    onChange={formikUtang.handleChange}
                    error={formikUtang.touched.personName && Boolean(formikUtang.errors.personName)}
                    helperText={formikUtang.touched.personName && formikUtang.errors.personName}
                    margin="normal"
                  />
                </form>
              )}
              {selectedOption === 'partial' && (
                <form onSubmit={formikPartial.handleSubmit}>
                  <TextField
                    type="number"
                    fullWidth
                    id="partialAmount"
                    name="partialAmount"
                    label="Input Cash"
                    value={formikPartial.values.partialAmount}
                    onChange={formikPartial.handleChange}
                    error={
                      formikPartial.touched.partialAmount &&
                      Boolean(formikPartial.errors.partialAmount)
                    }
                    helperText={
                      formikPartial.touched.partialAmount && formikPartial.errors.partialAmount
                    }
                    margin="normal"
                  />
                  <TextField
                    fullWidth
                    type="number"
                    id="desiredAmount"
                    name="desiredAmount"
                    label="Input Desired Amount"
                    value={formikPartial.values.desiredAmount}
                    onChange={formikPartial.handleChange}
                    error={
                      formikPartial.touched.desiredAmount &&
                      Boolean(formikPartial.errors.desiredAmount)
                    }
                    helperText={
                      formikPartial.touched.desiredAmount && formikPartial.errors.desiredAmount
                    }
                    margin="normal"
                  />
                  <TextField
                    fullWidth
                    id="personName"
                    name="personName"
                    label="Input Person Name"
                    value={formikPartial.values.personName}
                    onChange={formikPartial.handleChange}
                    error={
                      formikPartial.touched.personName && Boolean(formikPartial.errors.personName)
                    }
                    helperText={formikPartial.touched.personName && formikPartial.errors.personName}
                    margin="normal"
                  />
                </form>
              )}
            </Box>
          </DialogContent>
          <DialogActions>
            <Box sx={classes.footerButton}>
              <Button
                disabled={isLoading}
                onClick={handleProceedClick}
                variant="contained"
                color="primary"
              >
                {isLoading ? 'Processing' : 'Proceed'}
              </Button>
            </Box>
          </DialogActions>
        </Dialog>
      </div>

      {/* Receipt Modal */}
      <Dialog open={receiptOpen} onClose={() => setReceiptOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>
          <Typography align="center">Receipt</Typography>
          <IconButton
            onClick={() => setReceiptOpen(false)}
            aria-label="close"
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box p={2}>
            <Typography variant="body1" align="left" mb={1}>
              Akhiro Store
            </Typography>
            <Typography
              sx={classes.receiptsText}
              fontSize={'11px'}
              variant="body2"
              align="left"
              mb={1}
            >
              ** Receipt **
            </Typography>
            <Typography
              sx={classes.receiptsText}
              fontSize={'11px'}
              variant="body2"
              align="left"
              mb={1}
            >
              Date: {moment(allItems.date).format('llll')}
            </Typography>
            <Typography fontSize={'11px'} variant="body2" align="left" mb={1}>
              Type: {allItems.transactionType}
            </Typography>
            {/* <Typography fontSize={'11px'} variant="body2" align="left" mb={1}>
              {selectedOption === 'cash' &&
                `Cash Amount: ${receiptContent?.match(/Cash Amount: (.+)/)?.[1]}`}
              {selectedOption === 'partial' && `Cash: ${receiptContent?.match(/Cash: (.+)/)?.[1]}`}
              {selectedOption === 'utang' &&
                `Amount To Pay: ${receiptContent?.match(/Amount To Pay: (.+)/)?.[1]}`}
            </Typography>
            <Typography fontSize={'11px'} variant="body2" align="left" mb={1}>
              {selectedOption === 'partial' &&
                `Desired Amount: ${receiptContent?.match(/Desired Amount: (.+)/)?.[1]}`}
            </Typography>
            <Typography fontSize={'11px'} variant="body2" align="left" mb={1}>
              {selectedOption === 'cash' && `Change: ${receiptContent?.match(/Change: (.+)/)?.[1]}`}
              {selectedOption === 'partial' &&
                `Change: ${receiptContent?.match(/Change: (.+)/)?.[1]}`}
            </Typography> */}
            <Typography fontSize={'11px'} variant="body2" align="left" mb={1} fontWeight={700}>
              Items
            </Typography>

            {allItems?.items?.map((data: any) => {
              console.log(data);
              return (
                <>
                  <Box sx={classes.receiptsWrapper} key={data.id}>
                    <Typography
                      sx={classes.receiptsText}
                      fontSize={'11px'}
                      variant="body2"
                      align="left"
                      mb={1}
                    >
                      {data.name} x {data.quantity}
                    </Typography>
                    <Typography
                      sx={classes.receiptsText}
                      fontSize={'11px'}
                      variant="body2"
                      align="left"
                      mb={1}
                    >
                      {formatCurrency(data.price)}
                    </Typography>
                  </Box>
                </>
              );
            })}

            <Typography>- - - - - - - - - - - - - - - - - - - - - - -</Typography>
            <Box sx={classes.receiptsWrapper}>
              <Typography
                sx={classes.receiptsText}
                fontSize={'11px'}
                variant="body2"
                align="left"
                mb={1}
              >
                Total
              </Typography>
              <Typography
                sx={classes.receiptsText}
                fontSize={'11px'}
                variant="body2"
                align="left"
                mb={1}
              >
                {formatCurrency(allItems.total)}
              </Typography>
            </Box>
            {selectedOption === 'partial' && (
              <>
                <Box sx={classes.receiptsWrapper}>
                  <Typography
                    sx={classes.receiptsText}
                    fontSize={'11px'}
                    variant="body2"
                    align="left"
                    mb={1}
                  >
                    Partial Payment
                  </Typography>
                  <Typography
                    sx={classes.receiptsText}
                    fontSize={'11px'}
                    variant="body2"
                    align="left"
                    mb={1}
                  >
                    {formatCurrency(allItems?.partialAmount)}
                  </Typography>
                </Box>
              </>
            )}

            <Box sx={classes.receiptsWrapper}>
              <Typography
                sx={classes.receiptsText}
                fontSize={'11px'}
                variant="body2"
                align="left"
                mb={1}
              >
                Cash
              </Typography>
              <Typography
                sx={classes.receiptsText}
                fontSize={'11px'}
                variant="body2"
                align="left"
                mb={1}
              >
                {formatCurrency(allItems?.cash)}
              </Typography>
            </Box>
            <Box sx={classes.receiptsWrapper}>
              <Typography
                sx={classes.receiptsText}
                fontSize={'11px'}
                variant="body2"
                align="left"
                mb={1}
              >
                Change
              </Typography>
              <Typography
                sx={classes.receiptsText}
                fontSize={'11px'}
                variant="body2"
                align="left"
                mb={1}
              >
                {formatCurrency(allItems?.change)}
              </Typography>
            </Box>
            {selectedOption === 'partial' && (
              <>
                <Box sx={classes.receiptsWrapper}>
                  <Typography
                    sx={classes.receiptsText}
                    fontSize={'11px'}
                    variant="body2"
                    align="left"
                    mb={1}
                  >
                    Remaining Balance
                  </Typography>
                  <Typography
                    sx={classes.receiptsText}
                    fontSize={'11px'}
                    variant="body2"
                    align="left"
                    mb={1}
                  >
                    {formatCurrency(allItems?.remainingBalance)}
                  </Typography>
                </Box>
              </>
            )}

            {selectedOption === 'utang' && (
              <Typography fontSize={'11px'} variant="body2" align="left" mb={1}>
                Person Name: {allItems?.personName}
              </Typography>
            )}
            <Box mt={2}>
              <Typography fontSize={'11px'} variant="body2" align="left" color="textSecondary">
                Thank you for your payment!
              </Typography>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </div>
  );
}
