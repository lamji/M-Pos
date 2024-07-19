/* eslint-disable react-hooks/exhaustive-deps */
import Nav from '@/src/components/Nav';
import { Box, IconButton, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';

import { getSalesData } from '@/src/common/api/testApi';
import { formatCurrency } from '@/src/common/helpers';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import { setIsBackDropOpen } from '@/src/common/reducers/items';
import { useDispatch } from 'react-redux';
import moment from 'moment';

export default function Dashboard() {
  const dispatch = useDispatch();
  const [data, setData] = useState<any>({});
  const [refresh, setRefresh] = useState(false);
  const [filterData, setFilterData] = useState('dataToday');

  const getSales = async () => {
    dispatch(setIsBackDropOpen(true));
    try {
      const data = await getSalesData();
      if (data) {
        dispatch(setIsBackDropOpen(false));
        setData(data);
      }
    } catch (error) {
      console.log(error);
      dispatch(setIsBackDropOpen(false));
    }
  };

  const handleRefresh = () => {
    setRefresh(!refresh);
  };

  useEffect(() => {
    getSales();
  }, [refresh]);

  console.log('data', data);
  return (
    <div>
      <Nav isDashboard={true}>
        {/* <Box display="flex" alignItems="center">
          <Typography variant="h6" fontWeight={700}>
            Dashboard
          </Typography>
        </Box> */}
      </Nav>
      <Box
        sx={{
          padding: '10px',
          background: 'white',
          borderRadius: 15,
          marginTop: '-130px',
          height: '80vh',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',

            justifyContent: 'center',
          }}
        >
          <Typography align="center" fontWeight={700} variant="body1">
            SALES
          </Typography>
          <IconButton onClick={handleRefresh}>
            <AutorenewIcon />
          </IconButton>
        </Box>

        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          sx={{ width: '100%' }}
        >
          <Box
            sx={{
              padding: '10px',
              border: '2px solid #8d8d8d',
              background: '#c7c7c7',
              borderRadius: 2,
              width: '48%',
              height: '120px',
              boxShadow: '1px 1px 18px -5px rgba(0,0,0,0.75)',
            }}
            onClick={() => setFilterData('dataYesterday')}
          >
            <Typography fontSize="12px" fontWeight={700}>
              Yesterday
            </Typography>
            <Typography>{formatCurrency(data?.yesterday?.total ?? 0)}</Typography>
            <Box>
              <Typography
                sx={{
                  fontSize: '9px',
                  background: '#ff8e8e',
                  padding: '2px 4px',
                  borderRadius: '5px',
                  border: '1px solid #bf2e2e',
                }}
              >
                Utang: {formatCurrency(data?.yesterday?.Utang ?? 0)}
              </Typography>
              <Typography
                sx={{
                  fontSize: '9px',
                  background: '#9bc39b',
                  padding: '2px 4px',
                  borderRadius: '5px',
                  border: '1px solid green',
                  mt: '3px',
                }}
              >
                Cash: {formatCurrency(data?.yesterday?.Cash ?? 0)}
              </Typography>
            </Box>
          </Box>
          <Box
            onClick={() => setFilterData('dataToday')}
            sx={{
              padding: '10px',
              border: '2px solid #105942',
              background: '#b8ded2',
              borderRadius: 2,
              width: '48%',
              height: '120px',
              boxShadow: '1px 1px 18px -5px rgba(0,0,0,0.75)',
            }}
          >
            <Typography fontSize="12px" fontWeight={700}>
              Today
            </Typography>
            <Typography>{formatCurrency(data?.today?.total ?? 0)}</Typography>
            <Box>
              <Typography
                sx={{
                  fontSize: '9px',
                  background: '#ff8e8e',
                  padding: '2px 4px',
                  borderRadius: '5px',
                  border: '1px solid #bf2e2e',
                }}
              >
                Utang: {formatCurrency(data?.today?.Utang ?? 0)}
              </Typography>
              <Typography
                sx={{
                  fontSize: '9px',
                  background: '#9bc39b',
                  padding: '2px 4px',
                  borderRadius: '5px',
                  border: '1px solid green',
                  mt: '3px',
                }}
              >
                Cash: {formatCurrency(data?.today?.Cash ?? 0)}
              </Typography>
            </Box>
          </Box>
        </Box>
        <Box
          sx={{
            background: '#76bba5',
            p: 1,
            borderRadius: 2,
            mt: '5px',
            border: '2px solid #007550',
            boxShadow: '1px 1px 18px -5px rgba(0,0,0,0.75)',
          }}
        >
          <Typography
            sx={{
              fontSize: '11px',
              fontWeight: 700,
              mb: '10px',
            }}
          >
            Top 5 fast moving items
          </Typography>
          <Box sx={{ display: 'flex' }}>
            {data.top5Items &&
              data.top5Items.map((items: any, idx: number) => {
                return (
                  <Box
                    key={idx}
                    sx={{
                      padding: '9px',
                      borderRadius: 2,
                      border: '1px solid #007550',
                      gap: 2,
                      width: '130px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '1px',
                      background: '#abd7ab',
                    }}
                  >
                    <Box>
                      <Typography sx={{ fontSize: '9px', fontWeight: 700 }}>
                        {items?.name}
                      </Typography>
                      <Typography sx={{ fontSize: '9px', fontWeight: 700 }}>
                        Qty: {items.quantity}
                      </Typography>
                    </Box>
                  </Box>
                );
              })}
          </Box>
        </Box>
        <Box>
          <Typography
            sx={{
              fontSize: '12px',
              fontWeight: 700,
              my: 2,
            }}
          >{`${
            filterData === 'dataYesterday' ? `Yesterday's transaction` : `Today's transaction`
          }`}</Typography>
          <Box
            sx={{
              background: '#F6F5F2',
              borderRadius: 2,
            }}
          >
            {data ? (
              <>
                {data?.[filterData]
                  ?.slice()
                  .reverse()
                  ?.map((transaction: any, transactionIdx: number) => (
                    <Box key={transactionIdx}>
                      {transaction?.items?.map((item: any, itemIdx: number) => {
                        console.log(item);
                        return (
                          <Box
                            key={itemIdx}
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              padding: '10px',
                              borderBottom: '1px solid #e0e0e0',
                              margin: '5px',
                            }}
                          >
                            <Box>
                              <Typography sx={{ width: '170px' }} fontWeight={700} fontSize="10px">
                                {item.name} - {formatCurrency(item.price)}
                              </Typography>
                              <Typography sx={{ width: '100px', color: 'gray' }} fontSize="10px">
                                {moment(transaction.date).format('LTS')}
                              </Typography>
                            </Box>

                            <Typography fontSize="10px">qty: {item.quantity}</Typography>
                            <Typography
                              fontSize="10px"
                              sx={{
                                color:
                                  transaction.transactionType === 'Cash' ? '#9bc39b' : '#ff8e8e',
                              }}
                            >
                              {formatCurrency(transaction.total)}
                            </Typography>
                          </Box>
                        );
                      })}
                    </Box>
                  ))}
              </>
            ) : (
              <Box p={5}>No date</Box>
            )}
          </Box>
        </Box>
      </Box>
    </div>
  );
}
