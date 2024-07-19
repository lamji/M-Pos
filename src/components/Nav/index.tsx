import { Box, IconButton, Typography } from '@mui/material';
import SimpleDialogDemo from '../Loader/backdrop';
import { useRouter } from 'next/router';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { clearItems } from '@/src/common/reducers/items';
import { useDispatch } from 'react-redux';

export default function Nav({ children, isDashboard }: any) {
  const router = useRouter();
  const currentPath = router.pathname;
  const dispatch = useDispatch();
  console.log(currentPath);

  const handleBackClick = () => {
    if (currentPath === '/pos') {
      router.push('/');
      dispatch(clearItems());
    } else {
      router.push('/');
    }
  };

  return (
    <div>
      <Box
        sx={{
          padding: '20px 10px',
          background: '#0A736C',
          color: 'white',
          height: isDashboard ? 'auto' : 'auto',
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
          {currentPath === '/pos' && 'SAN ITEMS'}
          {currentPath === '/utang' && 'LIST'}
          {currentPath === '/add' && 'ADD / UPDATE'}
        </Typography>
      </Box>
      <SimpleDialogDemo />
      <Box
        sx={{
          marginTop: '200px',
          position: 'relative',
        }}
      >
        {children}
      </Box>
    </div>
  );
}
