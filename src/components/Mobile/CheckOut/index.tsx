import React, { useEffect, useState } from 'react';
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
  Autocomplete,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import useViewModel from './useViewModel';
import { useDispatch, useSelector } from 'react-redux';
import { formatCurrency } from '@/src/common/helpers';
import { getSelectedItems, setIsBackDropOpen } from '@/src/common/reducers/items';
import { getAllUtang, postTransaction } from '@/src/common/api/testApi';
import moment from 'moment';

interface Props {
  isRefresh: (i: boolean) => void;
}

export default function Checkout({ isRefresh }: Props) {
  const [refresh, setRefresh] = useState(false);
  const dispatch = useDispatch();
  const { total, items } = useSelector(getSelectedItems); // Get total from Redux
  const { classes, handleClickOpen, handleClose, open, fullScreen, handleClearItems, token } =
    useViewModel();
  const [selectedOption, setSelectedOption] = React.useState<'cash' | 'utang' | 'partial' | null>(
    null
  );
  const [receiptOpen, setReceiptOpen] = React.useState(false);
  const [allItems, setAllItems] = useState<any>([]);
  const [allItemsUtang, setAllItemsUtang] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(false);
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
      const transactionData = {
        type: 'Cash',
        items: items,
        cash: cashAmount,
        total,
      };
      setIsLoading(true);
      try {
        const data = await postTransaction(transactionData);
        if (data) {
          setAllItems(data.data);
          handleClearItems();
          setReceiptOpen(true);
          handleClose();
          setIsLoading(false);
          resetForm();
          dispatch(setIsBackDropOpen(false));
          setRefresh(!refresh);
          isRefresh(!refresh);
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
      const transactionData = {
        type: 'Utang',
        items: items,
        personName: values.personName,
        total,
        _id: values._id || undefined,
      };
      try {
        const data = await postTransaction(transactionData);
        if (data) {
          setAllItems(data.data);
          setReceiptOpen(true);
          handleClose();
          handleClearItems();
          resetForm();
          setIsLoading(false);
          setIsOld(true);
          dispatch(setIsBackDropOpen(false));
        }
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
      const partialAmount = Number(values.partialAmount);
      const desiredAmount = Number(values.desiredAmount);
      dispatch(setIsBackDropOpen(true));

      const transactionData = {
        type: 'partial',
        items: items,
        personName: values.personName,
        cash: partialAmount,
        total,
        partialAmount: desiredAmount,
        _id: values._id || undefined,
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
          dispatch(setIsBackDropOpen(false));
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

  // const handleAutocompleteChange = (event: any, value: any) => {
  //   // Set the selected value to Formik
  //   console.log('handleAutocompleteChange', value);
  //   formikPartial.setFieldValue('personName', value ? value.personName : '');
  //   formikUtang.setFieldValue('_id', value?._id ?? ''); // Set _id
  // };

  const getAllUtandData = async () => {
    try {
      const data = await getAllUtang();
      if (data) {
        setAllItemsUtang(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllUtandData();
  }, [allItems]);
  return (
    <div>
      <Box sx={classes.root}>
        <Box>
          {token && total > 0 && <Typography fontWeight={700}>{formatCurrency(total)}</Typography>}
          {/* Use total here */}
          {token && total > 0 && (
            <>
              <Button
                onClick={handleClickOpen}
                sx={{ ...classes.button, py: 1, width: '100%' }}
                variant="contained"
              >
                PAY
              </Button>
            </>
          )}
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
            <Typography variant="h5" fontWeight={700}>
              Check Out
            </Typography>
            <IconButton
              onClick={handleClose}
              aria-label="close"
              sx={{ position: 'absolute', right: 8, top: 8 }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <Box px={2}>
              <Typography fontWeight={700} variant="h6">
                Select Option
              </Typography>
            </Box>
            <Box
              px={2}
              sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
            >
              <Box
                onClick={() => handleOptionClick('cash')}
                sx={{
                  border: '2px solid',
                  borderColor: selectedOption === 'cash' ? '#ef783e' : 'gray',
                  background: selectedOption === 'cash' ? '#ef783e' : '#d1d1d1',
                  color: selectedOption === 'cash' ? 'white' : 'unset',
                  padding: '10px',
                  borderRadius: '10px',
                  width: '90px',
                  height: '80px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                Cash
              </Box>
              <Box
                onClick={() => handleOptionClick('utang')}
                sx={{
                  border: '2px solid',
                  borderColor: selectedOption === 'utang' ? '#ef783e' : 'gray',
                  background: selectedOption === 'utang' ? '#ef783e' : '#d1d1d1',
                  color: selectedOption === 'utang' ? 'white' : 'unset',
                  padding: '10px',
                  borderRadius: '10px',
                  width: '90px',
                  height: '80px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                Utang
              </Box>
              <Box
                onClick={() => handleOptionClick('partial')}
                sx={{
                  padding: '10px',
                  borderRadius: '10px',
                  width: '90px',
                  height: '80px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  border: '2px solid',
                  borderColor: selectedOption === 'partial' ? '#ef783e' : 'gray',
                  background: selectedOption === 'partial' ? '#ef783e' : '#d1d1d1',
                  color: selectedOption === 'partial' ? 'white' : 'unset',
                }}
              >
                Partial
              </Box>
            </Box>

            <Typography textTransform="capitalize" fontWeight={700} m={2}>
              {selectedOption}
            </Typography>
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
                <>
                  <form onSubmit={formikUtang.handleSubmit}>
                    <Box
                      sx={{
                        width: '100%',
                        textAlign: 'center',
                      }}
                    >
                      {isOld ? (
                        <>
                          <Autocomplete
                            // value={formikUtang.values.personName}
                            onChange={(event, value) => {
                              formikUtang.setFieldValue('_id', value?._id ?? ''); // Set _id
                              formikUtang.setFieldValue('personName', value?.personName ?? ''); // Set personName
                            }}
                            disablePortal
                            id="combo-box-demo"
                            options={allItemsUtang.listUtangName}
                            getOptionLabel={(option: any) => option?.personName}
                            sx={{ width: 300, marginBottom: 2 }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label="Select Name"
                                name="personName"
                                error={
                                  formikUtang.touched.personName &&
                                  Boolean(formikUtang.errors.personName)
                                }
                                helperText={
                                  formikUtang.touched.personName && formikUtang.errors.personName
                                }
                              />
                            )}
                          />
                          <Box
                            component="a"
                            sx={{
                              width: '100%',
                              textAlign: 'center',
                              cursor: 'pointer',
                              textDecoration: 'underline',
                              color: 'blue',
                              mt: 2,
                              fontSize: '12px',
                            }}
                            onClick={() => setIsOld(false)}
                          >
                            Not found?
                          </Box>
                        </>
                      ) : (
                        <>
                          <TextField
                            fullWidth
                            id="personName"
                            name="personName"
                            label="Input Person Name"
                            value={formikUtang.values.personName}
                            onChange={formikUtang.handleChange}
                            error={
                              formikUtang.touched.personName &&
                              Boolean(formikUtang.errors.personName)
                            }
                            helperText={
                              formikUtang.touched.personName && formikUtang.errors.personName
                            }
                            margin="normal"
                          />
                          <Box
                            component="a"
                            sx={{
                              width: '100%',
                              textAlign: 'center',
                              cursor: 'pointer',
                              textDecoration: 'underline',
                              color: 'blue',
                              mt: 2,
                              fontSize: '12px',
                            }}
                            onClick={() => setIsOld(true)}
                          >
                            Back
                          </Box>
                        </>
                      )}
                    </Box>
                  </form>
                </>
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
                    sx={{ marginBottom: '10px' }}
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
                    sx={{ marginBottom: '10px' }}
                  />
                  {isOld ? (
                    <>
                      <Autocomplete
                        onChange={(event, value) => {
                          formikPartial.setFieldValue('_id', value?._id ?? ''); // Set _id
                          formikPartial.setFieldValue('personName', value?.personName ?? ''); // Set personName
                        }}
                        disablePortal
                        id="combo-box-demo"
                        options={allItemsUtang.listUtangName}
                        getOptionLabel={(option: any) => option?.personName}
                        sx={{ width: '100%', marginBottom: 2 }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Select Name"
                            id="personName"
                            name="personName"
                            error={
                              formikPartial.touched.personName &&
                              Boolean(formikPartial.errors.personName)
                            }
                            helperText={
                              formikPartial.touched.personName && formikPartial.errors.personName
                            }
                          />
                        )}
                      />
                      <Box
                        component="a"
                        sx={{
                          width: '100%',
                          textAlign: 'center',
                          cursor: 'pointer',
                          textDecoration: 'underline',
                          color: 'blue',
                          mt: 2,
                          fontSize: '12px',
                        }}
                        onClick={() => setIsOld(false)}
                      >
                        Person not found?
                      </Box>
                    </>
                  ) : (
                    <>
                      <TextField
                        fullWidth
                        id="personName"
                        name="personName"
                        label="Input Person Name"
                        value={formikPartial.values.personName}
                        onChange={formikPartial.handleChange}
                        error={
                          formikPartial.touched.personName &&
                          Boolean(formikPartial.errors.personName)
                        }
                        helperText={
                          formikPartial.touched.personName && formikPartial.errors.personName
                        }
                      />
                      <Box
                        component="a"
                        sx={{
                          width: '100%',
                          textAlign: 'center',
                          cursor: 'pointer',
                          textDecoration: 'underline',
                          color: 'blue',
                          mt: 2,
                          fontSize: '12px',
                        }}
                        onClick={() => setIsOld(true)}
                      >
                        Back
                      </Box>
                    </>
                  )}
                </form>
              )}
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: '0px' }}>
            <Box sx={classes.footerButton}>
              <Button
                disabled={selectedOption ? false : true}
                onClick={handleProceedClick}
                variant="contained"
                color="primary"
                sx={{
                  width: '100%',
                  height: '80px',
                  fontSize: '20px',
                  fontWeight: 700,
                  '& .MuiButtonBase-root': { borderRadius: 'unset !important' },
                }}
              >
                {isLoading ? 'Processing' : `PAY ${formatCurrency(total)}`}
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
              Type: {allItems?.data?.transactionType}
            </Typography>
            <Typography fontSize={'11px'} variant="body2" align="left" mb={1} fontWeight={700}>
              Items
            </Typography>

            {allItems?.data?.items?.map((data: any, idx: number) => {
              return (
                <>
                  <Box sx={classes.receiptsWrapper} key={idx}>
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

            <Typography>- - - - - - - - - - - - - - - - - - - - -</Typography>
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
                    {formatCurrency(allItems?.data?.partialAmount) ?? '-'}
                  </Typography>
                </Box>
              </>
            )}

            {selectedOption !== 'utang' && (
              <>
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
                    {formatCurrency(allItems?.data?.cash)}
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
                    {formatCurrency(allItems?.data?.change) ?? '-'}
                  </Typography>
                </Box>
              </>
            )}

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
                    {formatCurrency(allItems?.remainingBalance) ?? '-'}
                  </Typography>
                </Box>
              </>
            )}

            {selectedOption === 'utang' && (
              <Typography fontSize={'11px'} variant="body2" align="left" mb={1}>
                Person Name: {allItems?.data?.personName ?? '-'}
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
