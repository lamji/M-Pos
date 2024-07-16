import Nav from '@/src/components/Nav';
import { Box, IconButton, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { getSalesData } from '@/src/common/api/testApi';
import { formatCurrency } from '@/src/common/helpers';

export default function Dashboard() {
  const router = useRouter();
  const [data, setData] = useState<any>({});

  const getSales = async () => {
    try {
      const data = await getSalesData();
      setData(data);
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getSales();
  }, []);
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
        <Typography align="center" fontWeight={700} variant="body1" mb={2}>
          SALES
        </Typography>
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
            <Typography>{formatCurrency(data?.today)}</Typography>
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
            <Typography>{formatCurrency(data?.yesterday)}</Typography>
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
