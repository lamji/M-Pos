/* eslint-disable react-hooks/exhaustive-deps */
import Nav from '@/src/components/Nav';
import { Box, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';

import { formatCurrency } from '@/src/common/helpers';
import { setIsBackDropOpen } from '@/src/common/reducers/items';
import { useDispatch } from 'react-redux';
import moment from 'moment';
import { GetServerSideProps } from 'next';
import { parse } from 'cookie';
import { findTop10FastMovingItemsThisWeek } from '@/src/common/app/lib/pouchDbTransaction';

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

export default function Dashboard() {
  const dispatch = useDispatch();
  const [data, setData] = useState<any>({});
  const [fastMoving, setFastMoving] = useState<any>();
  const [filterData, setFilterData] = useState('dataToday');

  const getSales = async () => {
    dispatch(setIsBackDropOpen(true));
    try {
      const [data] = await Promise.all([findTop10FastMovingItemsThisWeek()]);
      console.log('top10', data);
      setFastMoving(data);
      // const data = await getSalesData();
      // if (data) {
      //   dispatch(setIsBackDropOpen(false));
      //   setData(data);
      // }
      dispatch(setIsBackDropOpen(false));
    } catch (error) {
      console.log(error);
      dispatch(setIsBackDropOpen(false));
    }
  };

  useEffect(() => {
    getSales();
  }, []);

  return (
    <div>
      <Nav />
      <Box
        sx={{
          padding: '10px',
          background: 'white',
          borderRadius: 15,
          marginTop: '-130px',
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
              border: '2px solid #ff6b23',
              background: '#ef783e',
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
                  background: 'white',
                  padding: '4px',
                  borderRadius: '3px',
                  color: 'red',
                }}
              >
                Utang: {formatCurrency(data?.yesterday?.Utang ?? 0)}
              </Typography>
              <Typography
                sx={{
                  fontSize: '9px',
                  background: 'white',
                  padding: '4px',
                  borderRadius: '3px',
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
              border: '2px solid #ff6b23',
              background: '#ef783e',
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
                  background: 'white',
                  padding: '4px',
                  borderRadius: '3px',
                  color: 'red',
                }}
              >
                Utang: {formatCurrency(data?.today?.Utang ?? 0)}
              </Typography>
              <Typography
                sx={{
                  fontSize: '9px',
                  background: 'white',
                  padding: '4px',
                  borderRadius: '3px',
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
            background: '#ff6e31',
            p: 1,
            borderRadius: 2,
            mt: '5px',
            border: '2px solid #ffe8de',
            boxShadow: '1px 1px 18px -5px rgba(0,0,0,0.75)',
          }}
        >
          <Typography
            sx={{
              fontSize: '11px',
              fontWeight: 700,
              mb: '10px',
              color: 'white',
            }}
          >
            Weekly fast moving
          </Typography>
          <Box sx={{ overflowX: 'auto', display: 'flex', whiteSpace: 'wrap' }}>
            <Box sx={{ display: 'flex' }}>
              {fastMoving &&
                fastMoving.map((items: any, idx: number) => {
                  return (
                    <Box
                      key={idx}
                      sx={{
                        padding: '9px',
                        borderRadius: 2,
                        border: '1px solid #2d3349',
                        gap: 2,
                        width: '90px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'left',
                        justifyContent: 'center',
                        margin: '1px',
                        background: '#fff9f6',
                        flexShrink: 0, // Prevent the items from shrinking
                      }}
                    >
                      <Box>
                        <Typography sx={{ fontSize: '10px', fontWeight: 700 }}>
                          {items?.name}
                        </Typography>
                        <Typography sx={{ fontSize: '9px', fontWeight: 700 }}>
                          Sold: {items.quantity}
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: '9px',
                            fontWeight: 700,
                            color: items.stock <= 5 ? 'red' : 'green',
                          }}
                        >
                          Stocks: {items.stock}
                        </Typography>
                      </Box>
                    </Box>
                  );
                })}
            </Box>
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
              marginBottom: '100px',
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
                              <Typography
                                sx={{ width: '100px', color: 'gray', textTransform: 'capitalize' }}
                                fontSize="10px"
                              >
                                {transaction.transactionType}
                              </Typography>
                            </Box>

                            <Typography fontSize="10px">qty: {item.quantity}</Typography>
                            <Typography
                              fontSize="10px"
                              sx={{
                                color: transaction.transactionType === 'Cash' ? 'green' : 'red',
                              }}
                            >
                              {formatCurrency(item.quantity * item.price)}
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
