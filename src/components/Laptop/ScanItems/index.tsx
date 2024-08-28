import * as React from 'react';
import Box from '@mui/material/Box';
import { Divider, Typography } from '@mui/material';
import ComboBox from '../../Mobile/ScanItems';
import CardButton from '../../Mobile/CardButton';

export default function LaptopScanItems() {
  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Box sx={{ width: '500px', background: '#f7f7f7', padding: '15px 5px', height: '100vh' }}>
          <Box sx={{}}>
            <Typography fontWeight={700} mx={2} fontSize="25px">
              Transactions
            </Typography>
            <Box sx={{ marginTop: '200px' }}>
              <ComboBox />
            </Box>
          </Box>
        </Box>
        <Box id="right" sx={{ width: 'calc(100% - 500px)' }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '80vh',
              width: '70%',
            }}
          >
            item
          </Box>
          <Divider sx={{}} />
          <Typography px={1}>Keyboard shortcuts</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <CardButton
              height={40}
              description="Open checkout"
              width={80}
              header="CTRL + P"
              cardHight={60}
              onClick={() => console.log('test')}
            />
            <CardButton
              height={40}
              description="Logout"
              width={80}
              header="CTRL + L"
              cardHight={60}
              onClick={() => console.log('test')}
            />
            <CardButton
              height={40}
              description="Clear"
              width={80}
              header="CTRL + C"
              cardHight={60}
              onClick={() => console.log('test')}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
