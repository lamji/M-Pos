import React from 'react';
import useStyles from './useStyles';
import useViewModel from '../../Report/useViewModel';
import dynamic from 'next/dynamic';
import { Box, Grid } from '@mui/material';
import ReportFilter from '../../Dialog/reportFilter';
import CardButton from '../CardButton';

const Nav = dynamic(() => import('@/src/components/Nav'));

export default function ReportMobile() {
  const styles = useStyles();
  const model = useViewModel();
  return (
    <div style={styles.root}>
      <Nav />
      <Box className="ReportMobileContaimer" sx={styles.container}>
        <Grid container direction="row" justifyContent="center" alignItems="center">
          <Grid item>
            <CardButton
              images="/pricelist.png"
              height={80}
              width={60}
              header="Grocery List"
              onClick={model.handleGroceryListClick}
              cardHight={0}
            />
          </Grid>
          <Grid item>
            <CardButton
              images="/pricelist.png"
              height={80}
              width={60}
              header="Create Report"
              onClick={() => console.log('test')}
              cardHight={0}
            />
          </Grid>
        </Grid>
        {/* <Box gap={2} display="flex" justifyContent="space-between">
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
        </Box> */}

        <ReportFilter
          isOpen={model.isFilterOpen}
          handleClose={model.handleFilterModalClose}
          handleConfrim={model.handleFilterConfirm}
        />
      </Box>
    </div>
  );
}
