import { getAllUtang, getUtangById, postTransaction } from '@/src/common/api/testApi';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
  Autocomplete,
  TextField,
  InputAdornment,
  CircularProgress,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { formatCurrency } from '@/src/common/helpers';
import SearchIcon from '@mui/icons-material/Search';
import moment from 'moment';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { setIsBackDropOpen } from '@/src/common/reducers/items';
import Nav from '@/src/components/Nav';
import { getUtangData, setPayment, setUtangData } from '@/src/common/reducers/utangData';
import { useRouter } from 'next/router';

// types.ts
export interface Item {
  id: string;
  name: string;
  quantity: number;
  price: number;
  _id: string;
}

export interface Transaction {
  _id: string;
  items: Item[];
  date: string; // Date string to be parsed with moment
  personName: string;
  cash: number;
  total: number;
  remainingBalance?: number;
  partialAmount?: number;
  transactionType: string;
}

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

const UtangTransactions: React.FC = () => {
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
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    updateUtang();
  }, []);

  return (
    <>
      <Nav></Nav>
      <div style={{ padding: '20px', background: 'white', borderRadius: 25, marginTop: '-150px' }}>
        <h3 style={{ marginBottom: '10px' }}>Utang Transactions</h3>
        <Autocomplete
          disablePortal
          id="combo-box-demo"
          options={transactions?.utang || []}
          getOptionLabel={(option: any) => option?.personName}
          sx={{
            width: '100%',
            mb: '10px',
            '& .MuiAutocomplete-endAdornment': {
              display: 'none',
            },
            '& .MuiAutocomplete-inputRoot': {
              padding: '10px !important',

              borderRadius: '4px', // Optional: Add border radius
              '&:hover': {
                borderColor: '#888', // Change border color on hover
              },
            },
          }}
          onChange={handleChange}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Search Item"
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {params.InputProps.endAdornment}
                    <InputAdornment position="end">
                      <IconButton>
                        <SearchIcon />
                      </IconButton>
                    </InputAdornment>
                  </>
                ),
              }}
            />
          )}
        />
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          p={1}
          sx={{
            border: '1px solid #ccd2d7',
          }}
        >
          <Typography fontWeight={700}>Name</Typography>

          <Typography fontWeight={700}>Total</Typography>
          <Typography fontWeight={700} sx={{ textTransform: 'capitalize' }}>
            Action
          </Typography>
        </Box>
        <Box
          sx={{
            height: '60vh',
            width: '100%',
            borderRadius: '0px 0px 10px 10px',
            border: '1px solid #ccd2d7',
            overflow: 'scroll',
          }}
        >
          {isLoading ? (
            <>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '50vh', // Full viewport height
                  padding: '0 20px', // Optional: Add some horizontal padding
                  gap: '10px',
                }}
              >
                <CircularProgress />
              </Box>
            </>
          ) : (
            transactions?.utang?.map((data: any, idx: number) => {
              return (
                <Box
                  key={idx}
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  p={1}
                  sx={{
                    border: '1px solid #ccd2d7',
                  }}
                >
                  <Box sx={{ width: 70 }}>
                    <Typography fontSize={'12px'}>{data.personName}</Typography>
                  </Box>
                  <Typography fontSize={'12px'}>{formatCurrency(data.total)}</Typography>
                  <Button onClick={() => handleOpen(data)} sx={{ textTransform: 'capitalize' }}>
                    View
                  </Button>
                </Box>
              );
            })
          )}
        </Box>
        <Box display="flex" alignItems="center" justifyContent="end">
          <Typography fontWeight={700} py={2}>
            Total: {formatCurrency(transactions?.totalUtang ?? 0)}
          </Typography>
        </Box>

        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
          {type === 'adjustment' ? (
            <DialogTitle>Adjustment</DialogTitle>
          ) : (
            <DialogTitle>
              <Box>
                <Typography
                  sx={{ marginBottom: '0px' }}
                  variant="body1"
                  align="right"
                  gutterBottom
                  fontWeight={700}
                >
                  {selectedData?.personName}
                </Typography>
                {type != 'adjustment' && (
                  <Typography align="right" sx={{ fontSize: '10px' }}>
                    <strong>Total: {formatCurrency(selectedData?.total as number)}</strong>
                  </Typography>
                )}
              </Box>
            </DialogTitle>
          )}

          <DialogContent>
            <Box>
              {type === 'adjustment' ? (
                <>
                  <form onSubmit={formikUtang.handleSubmit}>
                    <Box sx={{ width: '100%', textAlign: 'center' }}>
                      <TextField
                        fullWidth
                        id="description"
                        name="description"
                        label="Input Description"
                        value={formikUtang.values.description}
                        onChange={formikUtang.handleChange}
                        error={
                          formikUtang.touched.description && Boolean(formikUtang.errors.description)
                        }
                        helperText={
                          formikUtang.touched.description && formikUtang.errors.description
                        }
                        margin="normal"
                        multiline
                        rows={4}
                      />

                      <TextField
                        fullWidth
                        id="amount"
                        name="amount"
                        type="number"
                        label="Input Amount"
                        value={formikUtang.values.amount}
                        onChange={formikUtang.handleChange}
                        error={formikUtang.touched.amount && Boolean(formikUtang.errors.amount)}
                        helperText={formikUtang.touched.amount && formikUtang.errors.amount}
                        margin="normal"
                      />
                      {/* <Button color="primary" variant="contained" type="submit">
                        Submit
                      </Button> */}
                    </Box>
                  </form>
                </>
              ) : (
                <>
                  {selectedData?.items?.map((item: any) => (
                    <Box
                      key={item._id}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '5px',
                        borderBottom: '1px solid gray',
                      }}
                    >
                      <Box>
                        <Typography fontSize={'10px'} fontWeight={700}>
                          {item.name}
                        </Typography>
                        <Typography fontSize={'9px'}>
                          {`Quantity: ${item.quantity} x ${formatCurrency(item.price)}`}
                        </Typography>
                        <Typography fontSize={'9px'}>
                          Date: {moment(item.date).format('llll')}
                        </Typography>
                      </Box>

                      <Box>
                        <Typography fontSize={'10px'}>
                          {formatCurrency(item.quantity * item.price)}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </>
              )}
            </Box>
          </DialogContent>
          <DialogActions>
            {type === 'adjustment' ? (
              <Button
                color="primary"
                variant="text"
                sx={{ textTransform: 'capitalize' }}
                type="submit"
                onClick={() => formikUtang.handleSubmit()}
              >
                Confirm
              </Button>
            ) : (
              <Button
                variant="text"
                sx={{ textTransform: 'capitalize' }}
                color="primary"
                onClick={handleAdjustMent}
              >
                Adjust
              </Button>
            )}

            {type != 'adjustment' && (
              <>
                <Button
                  variant="text"
                  sx={{ textTransform: 'capitalize' }}
                  color="primary"
                  onClick={() => hanndlePayment()}
                >
                  Pay
                </Button>
                <Button
                  variant="text"
                  sx={{ textTransform: 'capitalize' }}
                  color="error"
                  onClick={handleClose}
                >
                  Close
                </Button>
              </>
            )}
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
};

export default UtangTransactions;
