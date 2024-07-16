import * as React from 'react';

import Dialog from '@mui/material/Dialog';
import { Box, CircularProgress, DialogContent, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { getSelectedItems } from '@/src/common/reducers/items';

export default function SimpleDialogDemo() {
  const { isBackDropOpen } = useSelector(getSelectedItems);
  return (
    <div>
      <Dialog open={isBackDropOpen}>
        <DialogContent>
          <Typography>Please wait</Typography>
          <Box sx={{ textAlign: 'center' }}>
            <CircularProgress color="inherit" />
          </Box>
        </DialogContent>
      </Dialog>
    </div>
  );
}
