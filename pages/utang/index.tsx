import { getAllUtang } from '@/src/common/api/testApi';
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
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { formatCurrency } from '@/src/common/helpers';
import SearchIcon from '@mui/icons-material/Search';
import moment from 'moment';

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

const UtangTransactions: React.FC = () => {
  const router = useRouter();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedData, setSelectedData] = useState<Transaction | null>(null);

  const handleOpen = (row: Transaction) => {
    setSelectedData(row);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedData(null);
  };

  const getAllUtandData = async () => {
    try {
      const data = await getAllUtang();
      if (data) {
        setTransactions(data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    // const fetchTransactions = async () => {
    //   try {
    //     const data = await getTransactionsByType('utang');
    //     setTransactions(data);
    //   } catch (error) {
    //     console.error('Failed to fetch transactions:', error);
    //   }
    // };

    // fetchTransactions();
    getAllUtandData();
  }, []);

  return (
    <div style={{ padding: '10px' }}>
      <IconButton onClick={() => router.push('/')}>
        <ArrowBackIcon />
      </IconButton>
      <h3>Utang Transactions</h3>
      <Autocomplete
        disablePortal
        id="combo-box-demo"
        options={[]}
        getOptionLabel={(option: any) => option?.name}
        sx={{
          width: '100%',
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
        onChange={() => null}
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
          height: '70vh',
          width: '100%',
          borderRadius: '0px 0px 10px 10px',
          border: '1px solid #ccd2d7',
          overflow: 'scroll',
        }}
      >
        {/* <DataGrid
          rows={rows}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 10,
              },
            },
          }}
        /> */}

        {transactions.map((data: any, idx) => {
          console.log('utand data', data);
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
        })}
      </Box>
      <Box display="flex" alignItems="center" justifyContent="end">
        <Typography fontWeight={700} py={2}>
          Total: {formatCurrency(20000)}
        </Typography>
      </Box>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>Transaction Receipt</DialogTitle>
        <DialogContent>
          <Box>
            <Typography gutterBottom>{selectedData?.personName}</Typography>
            <Box sx={{ marginTop: '10px', height: '50vh', overflow: 'scroll' }}>
              {selectedData?.items.map((item: any) => (
                <Box
                  key={item._id}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '5px',
                  }}
                >
                  <Box>
                    <Typography fontSize={'12px'} fontWeight={700}>
                      {item.name}
                    </Typography>
                    <Typography fontSize={'12px'}>
                      {`Quantity: ${item.quantity} x ${formatCurrency(item.price)}`}
                    </Typography>
                    <Typography fontSize={'12px'}>
                      Date: {moment(item.date).format('llll')}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography fontSize={'12px'}>
                      {formatCurrency(item.quantity * item.price)}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
            <Typography variant="h6" align="right" sx={{ mt: 2 }}>
              <strong>Total: {formatCurrency(selectedData?.total as number)}</strong>
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="primary"
            onClick={() => alert('Implement Pay functionality')}
          >
            Pay
          </Button>
          <Button variant="contained" color="error" onClick={handleClose}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default UtangTransactions;
