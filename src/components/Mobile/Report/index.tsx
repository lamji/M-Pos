import React from 'react';
import useStyles from './useStyles';
import useViewModel from '../../Report/useViewModel';
import dynamic from 'next/dynamic';
import { Box, Button } from '@mui/material';
import LocalGroceryStoreIcon from '@mui/icons-material/LocalGroceryStore';
import SummarizeIcon from '@mui/icons-material/Summarize';
import ReportFilter from '../../Dialog/reportFilter';

const Nav = dynamic(() => import('@/src/components/Nav'));

export default function ReportMobile() {
  const styles = useStyles();
  const model = useViewModel();
  return (
    <div style={styles.root}>
      <Nav />
      <Box className="ReportMobileContaimer" sx={styles.container}>
        <Box gap={2} display="flex" justifyContent="space-between">
          <Button
            onClick={model.handleGroceryListClick}
            variant="contained"
            sx={{ color: 'white', fontSize: '12px' }}
            startIcon={<LocalGroceryStoreIcon />}
          >
            Grocery List
          </Button>
          <Button
            variant="contained"
            sx={{ color: 'white', fontSize: '12px' }}
            startIcon={<SummarizeIcon />}
          >
            Create Report
          </Button>
        </Box>

        <ReportFilter
          isOpen={model.isFilterOpen}
          handleClose={model.handleFilterModalClose}
          handleConfrim={model.handleFilterConfirm}
        />
      </Box>
    </div>
  );
}
