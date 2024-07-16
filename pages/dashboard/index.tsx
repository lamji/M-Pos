import Nav from '@/src/components/Nav';
import { Box, IconButton, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { getSalesData } from '@/src/common/api/testApi';
import { formatCurrency } from '@/src/common/helpers';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import { setIsBackDropOpen } from '@/src/common/reducers/items';
import { useDispatch } from 'react-redux';

export default function Dashboard() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [data, setData] = useState<any>({});
  const [refresh, setRefresh] = useState(false);

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
  return (
    <div>
      <Nav>
        <Box display="flex" alignItems="center">
          <IconButton onClick={() => router.push('/')}>
            <ArrowBackIcon sx={{ color: 'white' }} />
          </IconButton>
          <Typography variant="h6" fontWeight={700}>
            Dashboard
          </Typography>
        </Box>
      </Nav>
      <Box
        sx={{
          padding: '20px',
          background: 'white',
          borderRadius: 15,
          marginTop: '-110px',
          height: '80vh',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            mb: 2,
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
              border: '2px solid #105942',
              background: '#b8ded2',
              borderRadius: 2,
              width: '48%',
              height: '100px',
            }}
          >
            <Typography fontSize="12px" fontWeight={700}>
              Yesterday
            </Typography>
            <Typography>{formatCurrency(data?.today ?? 0)}</Typography>
          </Box>
          <Box
            sx={{
              padding: '10px',
              border: '2px solid #105942',
              background: '#b8ded2',
              borderRadius: 2,
              width: '48%',
              height: '100px',
            }}
          >
            <Typography fontSize="12px" fontWeight={700}>
              Today
            </Typography>
            <Typography>{formatCurrency(data?.yesterday ?? 0)}</Typography>
          </Box>
        </Box>
        <Box>
          <Typography
            sx={{
              fontSize: '12px',
              fontWeight: 700,
              my: 2,
            }}
          >{`Today's transaction`}</Typography>
        </Box>
      </Box>
    </div>
  );
}
