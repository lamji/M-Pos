import { Box, Typography } from '@mui/material';
import SimpleDialogDemo from '../Loader/backdrop';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { getUtangData } from '@/src/common/reducers/utangData';
import { enablePullToRefresh, statusBar } from 'webtonative';
import BottomNav from '../Mobile/bottomNav';
import Checkout from '../Mobile/CheckOut';
import { formatCurrency } from '@/src/common/helpers';

export default function Nav() {
  const router = useRouter();
  const currentPath = router.pathname;
  const state = useSelector(getUtangData);

  enablePullToRefresh(true);
  statusBar({
    style: 'dark',
    color: '#0A736C',
    overlay: true, //Only for android
  });

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
          height: '60px',
        }}
      >
        <Typography fontWeight={700} textAlign="center" mt={2}>
          {currentPath === '/dashboard' && 'Dashboard'}
          {currentPath === '/' && 'AKHIRO-POS'}

          {currentPath === '/utang' && 'Total Utang:  ' + formatCurrency(state.totalUtang)}
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
