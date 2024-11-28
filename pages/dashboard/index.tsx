/* eslint-disable react-hooks/exhaustive-deps */
import Nav from '@/src/components/Nav';
import { Accordion, AccordionDetails, AccordionSummary, Box, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { formatCurrency } from '@/src/common/helpers';
import { setIsBackDropOpen } from '@/src/common/reducers/items';
import { useDispatch } from 'react-redux';
import moment from 'moment';
import { GetServerSideProps } from 'next';
import { parse } from 'cookie';
import {
  findTop10FastMovingItemsThisWeek,
  readAllDocumentTransaction,
} from '@/src/common/app/lib/pouchDbTransaction';
import useViewModel from './useViewModel';

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
  const { classes } = useViewModel();
  const dispatch = useDispatch();
  const [data, setData] = useState<any>({});
  // const [fastMoving, setFastMoving] = useState<any>();
  const [filterData, setFilterData] = useState('today');

  const getSales = async () => {
    dispatch(setIsBackDropOpen(true));
    try {
      const [data, transactions] = await Promise.all([
        findTop10FastMovingItemsThisWeek(),
        readAllDocumentTransaction(),
      ]);
      console.log('top10', data, transactions);
      // setFastMoving(data);
      setData(transactions);

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
      <Box sx={classes.rootBox}>
        <Box sx={classes.saleBox}>
          <Box sx={classes.onClickBox} onClick={() => setFilterData('yesterday')}>
            <Typography fontSize="12px" fontWeight={700} color={'white'}>
              Yesterday
            </Typography>
            <Typography color={'white'} fontWeight={700}>
              {formatCurrency(data?.yesterday?.total ?? 0)}
            </Typography>
            <Box>
              <Typography sx={classes.utangTyp}>
                Utang: {formatCurrency(data?.yesterday?.totalUtang ?? 0)}
              </Typography>
              <Typography sx={classes.cashType}>
                Cash: {formatCurrency(data?.yesterday?.totalCash ?? 0)}
              </Typography>
            </Box>
          </Box>
          <Box onClick={() => setFilterData('today')} sx={classes.todayBox}>
            <Typography fontSize="12px" fontWeight={700} color={'white'}>
              Today
            </Typography>
            <Typography color={'white'} fontWeight={700}>
              {formatCurrency(data?.today?.total ?? 0)}
            </Typography>
            <Box>
              <Typography sx={classes.todayUtang}>
                Utang: {formatCurrency(data?.today?.totalUtang ?? 0)}
              </Typography>
              <Typography sx={classes.todayCash}>
                Cash: {formatCurrency(data?.today?.totalCash ?? 0)}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Box>
          <Typography sx={classes.filterTyp}>{`${
            filterData === 'yesterday' ? `Yesterday's transaction` : `Today's transaction`
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
                {data?.[filterData]?.docs
                  ?.slice()
                  .reverse()
                  ?.map((transaction: any, transactionIdx: number) => {
                    console.log('transaction', transaction);
                    if (transaction?.isPartial) {
                      return (
                        <>
                          <Box
                            key={transactionIdx}
                            sx={{
                              borderBottom: '1px solid #e0e0e0',
                              padding: '5px ',
                              margin: '5px',
                            }}
                          >
                            <Box>
                              {transaction.items.map((t: any, i: number) => {
                                return (
                                  <Box
                                    key={i}
                                    sx={{
                                      display: 'flex',
                                      alignItems: 'flex-start',
                                      justifyContent: 'space-between',
                                      mt: '3px',
                                    }}
                                  >
                                    <Box>
                                      <Typography
                                        sx={{ width: '170px' }}
                                        fontWeight={700}
                                        fontSize="10px"
                                      >
                                        {t.name} - {formatCurrency(t.price)}
                                      </Typography>
                                      <Typography
                                        sx={{ width: '100px', color: 'gray' }}
                                        fontSize="10px"
                                      >
                                        {moment(t.date).format('LTS')}
                                      </Typography>
                                      <Typography
                                        sx={{
                                          width: '100px',
                                          color: 'gray',
                                          textTransform: 'capitalize',
                                        }}
                                        fontSize="10px"
                                      >
                                        {t.transactionType}
                                      </Typography>
                                    </Box>

                                    <Typography
                                      fontSize="10px"
                                      sx={{
                                        color: t.type === 'Cash' ? 'green' : 'red',
                                      }}
                                    >
                                      {formatCurrency(t.quantity * t.price)}
                                    </Typography>
                                  </Box>
                                );
                              })}
                            </Box>
                            <div>
                              <Accordion>
                                <AccordionSummary
                                  expandIcon={<ExpandMoreIcon />}
                                  aria-controls="panel1-content"
                                  id="panel1-header"
                                  sx={{ fontSize: '13px' }}
                                >
                                  Items
                                </AccordionSummary>
                                <AccordionDetails>
                                  {transaction.partialItems.map((t: any, i: number) => {
                                    return (
                                      <Box
                                        key={i}
                                        sx={{
                                          display: 'flex',
                                          alignItems: 'center',
                                          justifyContent: 'space-between',
                                        }}
                                      >
                                        <Box>
                                          <Typography
                                            sx={{ width: '170px' }}
                                            fontWeight={700}
                                            fontSize="10px"
                                          >
                                            {t.name} - {formatCurrency(t.price)}
                                          </Typography>
                                          <Typography
                                            sx={{ width: '100px', color: 'gray' }}
                                            fontSize="10px"
                                          >
                                            {moment(t.date).format('LTS')}
                                          </Typography>
                                          <Typography
                                            sx={{
                                              width: '100px',
                                              color: 'gray',
                                              textTransform: 'capitalize',
                                            }}
                                            fontSize="10px"
                                          >
                                            {t.transactionType}
                                          </Typography>
                                        </Box>

                                        <Typography fontSize="10px">qty: {t.quantity}</Typography>
                                        <Typography fontSize="10px">
                                          {formatCurrency(t.quantity * t.price)}
                                        </Typography>
                                      </Box>
                                    );
                                  })}
                                </AccordionDetails>
                              </Accordion>
                            </div>
                          </Box>
                        </>
                      );
                    }
                    return (
                      <>
                        {transaction.items.map((t: any, i: number) => {
                          return (
                            <Box key={i} sx={classes.transactionItemsMap}>
                              <Box>
                                <Typography
                                  sx={{ width: '170px' }}
                                  fontWeight={700}
                                  fontSize="10px"
                                >
                                  {t.name} - {formatCurrency(t.price)}
                                </Typography>
                                <Typography sx={{ width: '100px', color: 'gray' }} fontSize="10px">
                                  {moment(t.date).format('LTS')}
                                </Typography>
                                <Typography
                                  sx={{
                                    width: '100px',
                                    color: 'gray',
                                    textTransform: 'capitalize',
                                  }}
                                  fontSize="10px"
                                >
                                  {t.transactionType}
                                </Typography>
                              </Box>

                              <Typography fontSize="10px">qty: {t.quantity}</Typography>
                              <Typography
                                fontSize="10px"
                                sx={{
                                  color: t.type === 'Cash' ? 'green' : 'red',
                                }}
                              >
                                {formatCurrency(t.quantity * t.price)}
                              </Typography>
                            </Box>
                          );
                        })}
                      </>
                    );
                  })}
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
