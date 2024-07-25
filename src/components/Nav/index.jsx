import { Box, IconButton, Typography } from '@mui/material';
import SimpleDialogDemo from '../Loader/backdrop';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { getUtangData } from '@/src/common/reducers/utangData';
import { enablePullToRefresh, statusBar } from 'webtonative';
import BottomNav from '../Mobile/bottomNav';
import Checkout from '../Mobile/CheckOut';
import { formatCurrency } from '@/src/common/helpers';
import { getCookie } from '@/src/common/app/cookie';
import MobileDrawer from '../Mobile/Drawer';
import MenuIcon from '@mui/icons-material/Menu';
import { useState } from 'react';

// import LogoutIcon from '@mui/icons-material/Logout';

export default function Nav() {
  const router = useRouter();
  const currentPath = router.pathname;
  const state = useSelector(getUtangData);
  const [open, setOpen] = useState(false);
  const token = getCookie('t');
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
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'left' }}>
          {token && (
            <>
              <Box>
                <IconButton onClick={() => setOpen(true)}>
                  <MenuIcon style={{ color: 'white' }} />
                </IconButton>
                <MobileDrawer status={open} setStatus={(i) => setOpen(i)} />
              </Box>
            </>
          )}

          {token && (
            <>
              <Typography fontWeight={700} textAlign="center">
                {currentPath === '/dashboard' && 'Dashboard'}
                {currentPath === '/' && 'POS'}

                {currentPath === '/utang' && 'Total Utang:  ' + formatCurrency(state.totalUtang)}
                {currentPath === '/add' && 'ADD / UPDATE'}
                {currentPath === '/payment' && 'PAYMENT'}
                {currentPath === '/admin' && 'ADMIN'}
              </Typography>
            </>
          )}
        </Box>
      </Box>
      <SimpleDialogDemo />
      <Box
        sx={{
          textAlign: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {currentPath === '/' && <Checkout />}
      </Box>
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
