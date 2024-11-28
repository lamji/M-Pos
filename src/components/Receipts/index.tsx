import React from 'react';
import moment from 'moment';
import { formatCurrency } from '@/src/common/helpers';
import { Box, Dialog, DialogContent, DialogTitle, IconButton, Typography } from '@mui/material';
import useStyles from './useStyles';
import CloseIcon from '@mui/icons-material/Close';

interface Receipts {
  setReceiptOpen: (i: boolean) => void;
  receiptOpen: boolean;
  allItems: any;
  selectedOption: 'cash' | 'utang' | 'partial' | null;
}

export default function Receipts({
  setReceiptOpen,
  receiptOpen,
  allItems,
  selectedOption,
}: Receipts) {
  const classes = useStyles();
  return (
    <div>
      {/* Receipt Modal */}
      <Dialog open={receiptOpen} maxWidth="xs" fullWidth>
        <DialogTitle>
          <Typography align="center">Receipt</Typography>
          <IconButton
            onClick={() => setReceiptOpen(false)}
            aria-label="close"
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box p={2}>
            <Typography variant="body1" align="left" mb={1}>
              Akhiro Store
            </Typography>
            <Typography
              sx={classes.receiptsText}
              fontSize={'11px'}
              variant="body2"
              align="left"
              mb={1}
            >
              ** Receipt **
            </Typography>
            <Typography
              sx={classes.receiptsText}
              fontSize={'11px'}
              variant="body2"
              align="left"
              mb={1}
            >
              Date: {moment(allItems?.date).format('llll')}
            </Typography>
            <Typography fontSize={'11px'} variant="body2" align="left" mb={1}>
              Type: {allItems?.type}
            </Typography>
            <Typography fontSize={'11px'} variant="body2" align="left" mb={1} fontWeight={700}>
              Items
            </Typography>

            {allItems?.data?.map((data: any, idx: number) => {
              return (
                <>
                  <Box sx={classes.receiptsWrapper} key={idx}>
                    <Typography
                      sx={classes.receiptsText}
                      fontSize={'11px'}
                      variant="body2"
                      align="left"
                      mb={1}
                    >
                      {data.name} x {data.quantity}
                    </Typography>
                    <Typography
                      sx={classes.receiptsText}
                      fontSize={'11px'}
                      variant="body2"
                      align="left"
                      mb={1}
                    >
                      {formatCurrency(data.price)}
                    </Typography>
                  </Box>
                </>
              );
            })}

            <Typography>- - - - - - - - - - - - - - - - - - - - -</Typography>
            <Box sx={classes.receiptsWrapper}>
              <Typography
                sx={classes.receiptsText}
                fontSize={'11px'}
                variant="body2"
                align="left"
                mb={1}
              >
                Total
              </Typography>
              <Typography
                sx={classes.receiptsText}
                fontSize={'11px'}
                variant="body2"
                align="left"
                mb={1}
              >
                {formatCurrency(allItems?.total)}
              </Typography>
            </Box>
            {selectedOption === 'partial' && (
              <>
                <Box sx={classes.receiptsWrapper}>
                  <Typography
                    sx={classes.receiptsText}
                    fontSize={'11px'}
                    variant="body2"
                    align="left"
                    mb={1}
                  >
                    Partial Payment
                  </Typography>
                  <Typography
                    sx={classes.receiptsText}
                    fontSize={'11px'}
                    variant="body2"
                    align="left"
                    mb={1}
                  >
                    {formatCurrency(allItems?.partialAmount) ?? '-'}
                  </Typography>
                </Box>
              </>
            )}

            {selectedOption !== 'utang' && (
              <>
                <Box sx={classes.receiptsWrapper}>
                  <Typography
                    sx={classes.receiptsText}
                    fontSize={'11px'}
                    variant="body2"
                    align="left"
                    mb={1}
                  >
                    Cash
                  </Typography>
                  <Typography
                    sx={classes.receiptsText}
                    fontSize={'11px'}
                    variant="body2"
                    align="left"
                    mb={1}
                  >
                    {formatCurrency(allItems?.cash)}
                  </Typography>
                </Box>
                <Box sx={classes.receiptsWrapper}>
                  <Typography
                    sx={classes.receiptsText}
                    fontSize={'11px'}
                    variant="body2"
                    align="left"
                    mb={1}
                  >
                    Change
                  </Typography>
                  <Typography
                    sx={classes.receiptsText}
                    fontSize={'11px'}
                    variant="body2"
                    align="left"
                    mb={1}
                  >
                    {formatCurrency(allItems?.change) ?? '-'}
                  </Typography>
                </Box>
              </>
            )}

            {selectedOption === 'partial' && (
              <>
                <Box sx={classes.receiptsWrapper}>
                  <Typography
                    sx={classes.receiptsText}
                    fontSize={'11px'}
                    variant="body2"
                    align="left"
                    mb={1}
                  >
                    Remaining Balance
                  </Typography>
                  <Typography
                    sx={classes.receiptsText}
                    fontSize={'11px'}
                    variant="body2"
                    align="left"
                    mb={1}
                  >
                    {formatCurrency(allItems?.remainingBalance) ?? '-'}
                  </Typography>
                </Box>
              </>
            )}

            {selectedOption === 'utang' && (
              <Typography fontSize={'11px'} variant="body2" align="left" mb={1}>
                Person Name: {allItems?.personName ?? '-'}
              </Typography>
            )}
            <Box mt={2}>
              <Typography fontSize={'11px'} variant="body2" align="left" color="textSecondary">
                Thank you for your payment!
              </Typography>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </div>
  );
}
