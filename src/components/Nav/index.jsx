import { Box, IconButton, Typography } from '@mui/material';
import SimpleDialogDemo from '../Loader/backdrop';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { getUtangData } from '@/src/common/reducers/utangData';
import { enablePullToRefresh, statusBar } from 'webtonative';
import BottomNav from '../Mobile/bottomNav';
import Checkout from '../Mobile/CheckOut';
import { formatCurrency } from '@/src/common/helpers';
import { getCookie, clearCookie } from '@/src/common/app/cookie';
import LogoutIcon from '@mui/icons-material/Logout';

export default function Nav() {
  const router = useRouter();
  const currentPath = router.pathname;
  const state = useSelector(getUtangData);
  const token = getCookie('t');
  enablePullToRefresh(true);
  statusBar({
    style: 'dark',
    color: '#0A736C',
    overlay: true, //Only for android
  });

  const handleSignout = async () => {
    clearCookie();
    router.push('/');
  };
  return (
    <div>
      <Box
        sx={{
          padding: '10px',
          background: token ? '#0A736C' : 'white',
          color: 'white',
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          zIndex: 1000,

          height: '60px',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {token && (
            <>
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
            </>
          )}
          <IconButton onClick={handleSignout}>
            <LogoutIcon style={{ color: 'white' }} />
          </IconButton>
        </Box>
      </Box>
      <SimpleDialogDemo />
      <Box
        sx={{
          marginTop: '200px',
          position: 'relative',
        }}
      ></Box>
      {token && <BottomNav />}
    </div>
  );
}
