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
// import { getAllUtang, postTransaction } from '@/src/common/api/testApi';
import moment from 'moment';
import hotkeys from 'hotkeys-js';
import { useRouter } from 'next/router';
import { clearCookie } from '@/src/common/app/cookie';
import { readAllDocumentsUtang, updateUtang } from '@/src/common/app/lib/pouchDbUtang';
import { createDocumentTransaction } from '@/src/common/app/lib/pouchDbTransaction';
import { getDataRefetch, setRefetch } from '@/src/common/reducers/data';

interface Props {
  isRefresh: (i: boolean) => void;
}

export default function Checkout({ isRefresh }: Props) {
  const [refresh, setRefresh] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const { total, items } = useSelector(getSelectedItems); // Get total from Redux
  const app = useSelector(getDataRefetch);
  console.log('transactionData', app);
  const {
    classes,
    handleClickOpen,
    handleClose,
    open,
    fullScreen,
    handleClearItems,
    token,
    isMobile,
  } = useViewModel();
  const [selectedOption, setSelectedOption] = React.useState<'cash' | 'utang' | 'partial' | null>(
    null
  );
  const [receiptOpen, setReceiptOpen] = React.useState(false);
  const [allItems, setAllItems] = useState<any>([]);
  const [allItemsUtang, setAllItemsUtang] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [allUtamgList, setAllUtangList] = useState<any>();
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
        _id: new Date(),
      };
      setIsLoading(true);
      try {
        const data = await createDocumentTransaction(transactionData);

        console.log('transactionData', data);
        if (data) {
          setAllItems(data);
          handleClearItems();
          setReceiptOpen(true);
          handleClose();
          setIsLoading(false);
          resetForm();
          dispatch(setIsBackDropOpen(false));
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
      const transactionUtang = {
        type: 'Utang',
        items: items,
        personName: values.personName,
        total,
        _id: values._id || undefined,
      };
      const transactionData = {
        type: 'Utang',
        items: items,
        personName: values.personName,
        total,
        _id: new Date(),
      };
      try {
        await createDocumentTransaction(transactionData);
        const data = await updateUtang(transactionUtang);
        setAllItems(data);
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
        _id: new Date() || undefined,
      };

      const transactionUtang = {
        type: 'partial',
        items: [
          {
            name: `Partial Balance of ${moment(new Date()).format('lll')}`,
            price: total - desiredAmount,
            quantity: 1,
            id: new Date(),
          },
        ],
        personName: values.personName,
        cash: partialAmount,
        total: total - desiredAmount,
        partialAmount: desiredAmount,
        _id: new Date() || undefined,
      };

      setIsLoading(true);
      try {
        const data = await createDocumentTransaction(transactionData);
        await updateUtang(transactionUtang);
        setAllItems(data);
        if (data) {
          setIsLoading(false);
          handleClearItems();
          setReceiptOpen(true);
          resetForm();
          handleClose();
          dispatch(setIsBackDropOpen(false));
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

  const getAllUtandData = async () => {
    try {
      const docs = await readAllDocumentsUtang();
      console.log(docs);
      if (docs) {
        setAllItemsUtang(docs);
        // Get a list of all Utang names
        const listUtangName = docs.map((item) => ({
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
    getAllUtandData();
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
  }, []);

  return (
    <div>
      <Box
        sx={{ borderRadius: '5px', marginBottom: '10px', marginTop: isMobile ? '50px' : '10px' }}
      >
        {isMobile ? (
          <>
            <Box>
              {token && total > 0 && (
                <Typography fontWeight={700}>{formatCurrency(total)}</Typography>
              )}
              {/* Use total here */}
              {token && total > 0 && (
                <>
                  <Button
                    onClick={handleClickOpen}
                    sx={{ ...classes.button, py: 1, width: '100%', color: 'white' }}
                    variant="contained"
                  >
                    PAY
                  </Button>
                </>
              )}
            </Box>
          </>
        ) : (
          <>
            <Box sx={{ textAlign: 'left' }}>
              <Typography mb={2} fontSize="20px" fontWeight={700}>
                TOTAL: {formatCurrency(total)}
              </Typography>

              <Button
                onClick={handleClickOpen}
                sx={{ width: '100%', height: '100px', color: 'white', fontSize: '30px' }}
                variant="contained"
              >
                CHECKOUT
              </Button>
            </Box>
          </>
        )}
      </Box>
      <div>
        <Dialog
          fullScreen={fullScreen}
          open={open}
          onClose={handleClose}
          aria-labelledby="responsive-dialog-title"
          maxWidth={'xs'}
        >
          <Box>
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
          </Box>
          <DialogContent>
            <Box px={2}>
              <Typography fontWeight={700} variant="h6">
                Select Option
              </Typography>
            </Box>
            <Box px={2} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
                  mx: '10px',
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
                  mx: '10px',
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
                  mx: '10px',
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
                    <Box>
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
                            options={allUtamgList}
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
                  <Box>
                    <TextField
                      type="number"
                      fullWidth
                      id="partialAmount"
                      name="partialAmount"
                      label="Input Cash"
                      margin="normal"
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
                          options={allItemsUtang}
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
                  </Box>
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
              Date: {moment(allItems?.date).format('llll')}
            </Typography>
            <Typography fontSize={'11px'} variant="body2" align="left" mb={1}>
              Type: {allItems?.type}
            </Typography>
            <Typography fontSize={'11px'} variant="body2" align="left" mb={1} fontWeight={700}>
              Items
            </Typography>

            {allItems?.data?.map((data: any, idx: number) => {
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
                    {formatCurrency(allItems?.partialAmount) ?? '-'}
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
                    {formatCurrency(allItems?.change) ?? '-'}
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
                Person Name: {allItems?.personName ?? '-'}
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
