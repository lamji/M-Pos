import { Box } from '@mui/material';
import SimpleDialogDemo from '../Loader/backdrop';

export default function Nav({ children }: any) {
  return (
    <div>
      <Box
        sx={{
          padding: '20px 10px',
          background: '#0A736C',
          color: 'white',
          height: '200px',
        }}
      >
        {children}
      </Box>
      <SimpleDialogDemo />
    </div>
  );
}
