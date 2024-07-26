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
import React from 'react';
import { formatCurrency } from '@/src/common/helpers';
import SearchIcon from '@mui/icons-material/Search';
import moment from 'moment';
import Nav from '@/src/components/Nav';
import useViewModel from './useViewModel';

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
  const {
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
  } = useViewModel();
  return (
    <>
      <Nav></Nav>
      <div style={{ padding: '20px', background: 'white', borderRadius: 25, marginTop: '-150px' }}>
        <Box
          sx={{
            background: '#ffb7b7',
            border: '2px solid #c54a4a',
            borderRadius: '10px',
            mb: '10px',
            textAlign: 'center',
            p: '10px',
            fontWeight: 700,
          }}
        >
          Total: {formatCurrency(state.totalUtang)}
        </Box>
        <Autocomplete
          disablePortal
          id="combo-box-demo"
          options={transactions?.listUtangName || []}
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
            width: '100%',
            borderRadius: '0px 0px 10px 10px',
            border: '1px solid #ccd2d7',
            overflow: 'scroll',
            marginBottom: '100px',
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
        {/* <Box display="flex" alignItems="center" justifyContent="end">
          <Typography fontWeight={700} py={2}>
            Total: {formatCurrency(transactions?.totalUtang ?? 0)}
          </Typography>
        </Box> */}

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
                  {selectedData?.items
                    ?.slice()
                    .reverse()
                    .map((item: any) => (
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
