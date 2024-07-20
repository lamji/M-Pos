import { Box, Typography } from '@mui/material';
import SimpleDialogDemo from '../Loader/backdrop';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { setData } from '@/src/common/reducers/data';
import { setUtangData } from '@/src/common/reducers/utangData';
import { enablePullToRefresh, statusBar } from 'webtonative';
import BottomNav from '../Mobile/bottomNav';
import Checkout from '../Mobile/CheckOut';
import { useEffect } from 'react';

export default function Nav() {
  const router = useRouter();
  const currentPath = router.pathname;
  const dispatch = useDispatch();

  enablePullToRefresh(true);
  statusBar({
    style: 'dark',
    color: '#0A736C',
    overlay: true, //Only for android
  });

  const refetch = async () => {
    try {
      const [utang, items] = await Promise.all([fetch('/api/utang'), fetch('/api/items2')]);

      if (!utang.ok || !items.ok) {
        throw new Error('One or more requests failed');
      }

      const data1 = await utang.json();
      const data2 = await items.json();
      dispatch(setData(data2));
      dispatch(setUtangData(data1));

      // Handle the fetched data as needed
      // For example, updating state if you are using a framework/library like React
    } catch (error) {
      console.error('Failed to refetch APIs:', error);
    }
  };

  useEffect(() => {
    refetch();
  }, []);

  return (
    <div>
      <Box
        sx={{
          padding: '10px',
          background: '#0A736C',
          color: 'white',
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography fontWeight={700} textAlign="center" mt={2}>
          {currentPath === '/dashboard' && 'Dashboard'}
          {currentPath === '/' && 'AKHIRO-POS'}

          {currentPath === '/utang' && 'LIST'}
          {currentPath === '/add' && 'ADD / UPDATE'}
          {currentPath === '/payment' && 'PAYMENT'}
          {currentPath === '/admin' && 'ADMIN'}
        </Typography>
        <Box
          sx={{
            textAlign: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {currentPath === '/pos' && <Checkout />}
        </Box>
      </Box>
      <SimpleDialogDemo />
      <Box
        sx={{
          marginTop: '200px',
          position: 'relative',
        }}
      ></Box>
      <BottomNav />
    </div>
  );
}
