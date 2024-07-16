import { getAllUtang, getUtangById } from '@/src/common/api/testApi';
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
import { useRouter } from 'next/router';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { formatCurrency } from '@/src/common/helpers';
import SearchIcon from '@mui/icons-material/Search';
import moment from 'moment';
import Nav from '@/src/components/Mobile/Nav';

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
  const [transactions, setTransactions] = useState<any>([]);
  const [open, setOpen] = useState(false);
  const [selectedData, setSelectedData] = useState<Transaction | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

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
  const getAllUtandData = async () => {
    setIsLoading(true);
    try {
      const data = await getAllUtang();
      if (data) {
        setTransactions(data);
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };
  useEffect(() => {
    getAllUtandData();
  }, []);

  return (
    <>
      <Nav>
        <Box display="flex" alignItems="center">
          <IconButton onClick={() => router.push('/')}>
            <ArrowBackIcon sx={{ color: 'white' }} />
          </IconButton>
          <Typography variant="h6" fontWeight={700}>
            AKHIRO POS
          </Typography>
        </Box>
      </Nav>
      <div style={{ padding: '20px', background: 'white', borderRadius: 25, marginTop: '-120px' }}>
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
            height: '50vh',
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
            transactions?.utang.map((data: any, idx: number) => {
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
            Total: {formatCurrency(transactions?.totalUtang) ?? ''}
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
    </>
  );
};

export default UtangTransactions;
