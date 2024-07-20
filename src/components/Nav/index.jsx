import { Box, IconButton, Typography } from '@mui/material';
import SimpleDialogDemo from '../Loader/backdrop';
import { useRouter } from 'next/router';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { clearItems } from '@/src/common/reducers/items';
import { useDispatch } from 'react-redux';
import { setData } from '@/src/common/reducers/data';
import { setUtangData } from '@/src/common/reducers/utangData';
import { enablePullToRefresh, statusBar } from 'webtonative';

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
      const [utang, items] = await Promise.all([
        fetch('/api/utang'),
        fetch('/api/items2'),
        // fetch('https://api.example.com/endpoint3'),
      ]);

      if (!utang.ok || !items.ok) {
        throw new Error('One or more requests failed');
      }

      const data1 = await utang.json();
      const data2 = await items.json();
      // const data3 = await response3.json();

      // console.log('Data from endpoint1:', data1);
      // console.log('Data from endpoint2:', data2);
      // console.log('Data from endpoint3:', data3);
      dispatch(setData(data2));
      dispatch(setUtangData(data1));

      // Handle the fetched data as needed
      // For example, updating state if you are using a framework/library like React
    } catch (error) {
      console.error('Failed to refetch APIs:', error);
    }
  };

  const handleBackClick = () => {
    if (currentPath === '/pos') {
      router.push('/');
      dispatch(clearItems());
    } else {
      router.push('/');
    }
    refetch();
  };

  return (
    <div>
      <Box
        sx={{
          padding: '20px 10px',
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
        {currentPath !== '/' && (
          <IconButton onClick={handleBackClick} sx={{ position: 'absolute', left: '10px' }}>
            <ArrowBackIcon sx={{ color: 'white' }} />
          </IconButton>
        )}
        <Typography fontWeight={700}>
          {currentPath === '/dashboard' && 'Dashboard'}
          {currentPath === '/' && 'AKHIRO-POS'}
          {currentPath === '/pos' && 'POS'}
          {currentPath === '/utang' && 'LIST'}
          {currentPath === '/add' && 'ADD / UPDATE'}
          {currentPath === '/payment' && 'PAYMENT'}
          {currentPath === '/admin' && 'ADMIN'}
        </Typography>
      </Box>
      <SimpleDialogDemo />
      <Box
        sx={{
          marginTop: '200px',
          position: 'relative',
        }}
      ></Box>
    </div>
  );
}
