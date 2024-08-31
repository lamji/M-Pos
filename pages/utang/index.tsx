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
  Paper,
  InputBase,
  Divider,
} from '@mui/material';
import React from 'react';
import { formatCurrency } from '@/src/common/helpers';
import { TbReportSearch } from 'react-icons/tb';
import moment from 'moment';
import Nav from '@/src/components/Nav';
import useViewModel from './useViewModel';
import { GetServerSideProps } from 'next';
import { RiExpandDiagonalFill } from 'react-icons/ri';
import { parse } from 'cookie';
import { IoIosArrowRoundBack } from 'react-icons/io';

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { req } = context;
  const cookie = req.headers.cookie;

  const cookies = cookie ? parse(cookie) : undefined;
  const isAuthenticated = cookies?.t ? true : false;

  if (!isAuthenticated) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  return {
    props: {
      fullMode: false,
    },
  };
};

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
    grandTotal,
    hanndlePayment,
    handleAdjustMent,
    formikUtang,
    open,
    handleOpen,
    type,
    handleClose,
    selectedData,
    utangList,
    handleSearchChange,
    searchTerm,
    setType,
  } = useViewModel();
  return (
    <>
      <Nav />
      <div
        style={{
          background: 'white',

          marginTop: '-150px',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            height: '180px',
            backgroundColor: 'primary.main',
          }}
        >
          <Box sx={{ marginTop: '-60px', px: '20px', width: '100%' }}>
            <Paper
              component="form"
              sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: '100%' }}
            >
              <InputBase
                sx={{ ml: 1, flex: 1 }}
                placeholder="Search Name"
                inputProps={{ 'aria-label': 'search google maps' }}
                value={searchTerm}
                onChange={handleSearchChange}
              />
              <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
              <IconButton color="primary" sx={{ p: '10px' }} aria-label="directions">
                <TbReportSearch />
              </IconButton>
            </Paper>
            <Typography my={1} sx={{ fontWeight: 700, color: 'white', fontSize: '20px' }}>
              {formatCurrency(grandTotal)}
            </Typography>
          </Box>
        </Box>
        <Box
          sx={{
            padding: '20px 40px',
            overflowY: 'scroll',
            marginBottom: '50px',
            height: '70vh',
            backgroundColor: 'white',
            zIndex: 999,
            marginTop: '-70px',
            borderRadius: '80px 0 0 0',
          }}
        >
          {utangList
            ?.slice()
            ?.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
            ?.map((data: any, idx: number) => {
              return (
                <Box
                  key={idx}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: '#c8c8c8',
                    padding: '15px 10px',
                    my: 1,
                    borderRadius: '10px',
                  }}
                  onClick={() => handleOpen(data as any)}
                >
                  <Box>
                    <Typography
                      sx={{ fontSize: '13px', fontWeight: 700, textTransform: 'capitalize' }}
                    >
                      {data.personName}
                    </Typography>
                    <Typography sx={{ fontSize: '11px', color: 'gray' }}>
                      {formatCurrency(data.total)}
                    </Typography>
                  </Box>
                  <IconButton onClick={() => handleOpen(data as any)}>
                    <RiExpandDiagonalFill />
                  </IconButton>
                </Box>
              );
            })}
        </Box>

        <Dialog open={open} onClose={handleClose} fullWidth fullScreen>
          {type === 'adjustment' ? (
            <Box sx={{ p: 2 }}>
              <IconButton
                onClick={() => {
                  setType('');
                }}
              >
                <IoIosArrowRoundBack />
              </IconButton>
              <Typography mx={1} fontWeight={700}>
                New Custom Utang
              </Typography>
            </Box>
          ) : (
            <DialogTitle>
              <Box>
                <IconButton onClick={handleClose}>
                  <IoIosArrowRoundBack />
                </IconButton>
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
                  <Typography align="right" sx={{ fontSize: '13px' }}>
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
                        label="Input Item"
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
                        label="Amount"
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
                    .map((item: any, id: any) => {
                      return (
                        <Box
                          key={id}
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
                      );
                    })}
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
                variant="outlined"
                sx={{ textTransform: 'capitalize' }}
                color="primary"
                onClick={handleAdjustMent}
              >
                New
              </Button>
            )}

            {type != 'adjustment' && (
              <>
                <Button
                  variant="outlined"
                  sx={{ textTransform: 'capitalize' }}
                  color="success"
                  onClick={() => hanndlePayment()}
                >
                  Pay
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
