import React from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  IconButton,
  Typography,
  TextField,
  Autocomplete,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { formatCurrency } from '@/src/common/helpers';
import useViewModel from './useViewModel';
import Receipts from '../../Receipts';

export interface CheckoutProps {
  isRefresh: (i: boolean) => void;
}

export default function Checkout({ isRefresh }: CheckoutProps) {
  const { classes, model, actions } = useViewModel({ isRefresh });
  return (
    <div>
      <Box sx={{ borderRadius: '5px', marginBottom: '10px', marginTop: '5px' }}>
        {model.isMobile ? (
          <>
            <Box>
              <>
                <Button
                  onClick={actions.handleClickOpen}
                  sx={{ ...classes.button, py: 1, width: '100%', background: 'white' }}
                  variant="contained"
                  disabled={model.total === 0}
                  startIcon={
                    <Typography
                      sx={{ fontWeight: 700, marginRight: '20px', fontSize: '17px !important' }}
                    >
                      {formatCurrency(model.total)}
                    </Typography>
                  }
                >
                  CHECKOUT
                </Button>
              </>
            </Box>
          </>
        ) : (
          <>
            <Box sx={{ textAlign: 'left' }}>
              <Typography mb={2} fontSize="20px" fontWeight={700}>
                TOTAL: {formatCurrency(model.total)}
              </Typography>

              <Button
                onClick={actions.handleClickOpen}
                sx={{ width: '100%', height: '100px', color: 'white', fontSize: '30px' }}
                variant="contained"
              >
                CHECKOUT
              </Button>
            </Box>
          </>
        )}
      </Box>
      <div>
        <Dialog
          fullScreen={model.fullScreen}
          open={model.open}
          onClose={actions.handleClose}
          aria-labelledby="responsive-dialog-title"
          maxWidth={'xs'}
        >
          <Box>
            <Typography variant="h5" fontWeight={700}>
              Check Out
            </Typography>
            <IconButton
              onClick={actions.handleClose}
              aria-label="close"
              sx={{ position: 'absolute', right: 8, top: 8 }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
          <DialogContent>
            <Box px={2}>
              <Typography fontWeight={700} variant="h6">
                Select Option
              </Typography>
            </Box>
            <Box px={2} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Box
                onClick={() => actions.handleOptionClick('cash')}
                sx={{
                  border: '2px solid',
                  borderColor: model.selectedOption === 'cash' ? '#ef783e' : 'gray',
                  background: model.selectedOption === 'cash' ? '#ef783e' : '#d1d1d1',
                  color: model.selectedOption === 'cash' ? 'white' : 'unset',
                  padding: '10px',
                  borderRadius: '10px',
                  width: '90px',
                  height: '80px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  mx: '10px',
                }}
              >
                Cash
              </Box>
              <Box
                onClick={() => actions.handleOptionClick('utang')}
                sx={{
                  border: '2px solid',
                  borderColor: model.selectedOption === 'utang' ? '#ef783e' : 'gray',
                  background: model.selectedOption === 'utang' ? '#ef783e' : '#d1d1d1',
                  color: model.selectedOption === 'utang' ? 'white' : 'unset',
                  padding: '10px',
                  borderRadius: '10px',
                  width: '90px',
                  height: '80px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  mx: '10px',
                }}
              >
                Utang
              </Box>
              <Box
                onClick={() => actions.handleOptionClick('partial')}
                sx={{
                  padding: '10px',
                  borderRadius: '10px',
                  width: '90px',
                  height: '80px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  border: '2px solid',
                  borderColor: model.selectedOption === 'partial' ? '#ef783e' : 'gray',
                  background: model.selectedOption === 'partial' ? '#ef783e' : '#d1d1d1',
                  color: model.selectedOption === 'partial' ? 'white' : 'unset',
                  mx: '10px',
                }}
              >
                Partial
              </Box>
            </Box>

            <Typography textTransform="capitalize" fontWeight={700} m={2}>
              {model.selectedOption}
            </Typography>
            <Box px={2}>
              {model.selectedOption === 'cash' && (
                <form onSubmit={model.formikCash.handleSubmit}>
                  <TextField
                    fullWidth
                    id="cashAmount"
                    name="cashAmount"
                    label="Input Cash"
                    value={model.formikCash.values.cashAmount}
                    onChange={model.formikCash.handleChange}
                    error={
                      model.formikCash.touched.cashAmount &&
                      Boolean(model.formikCash.errors.cashAmount)
                    }
                    helperText={
                      model.formikCash.touched.cashAmount && model.formikCash.errors.cashAmount
                    }
                    margin="normal"
                    type="number"
                  />
                </form>
              )}
              {model.selectedOption === 'utang' && (
                <>
                  <form onSubmit={model.formikUtang.handleSubmit}>
                    <Box>
                      {model.isOld ? (
                        <>
                          <Autocomplete
                            // value={formikUtang.values.personName}
                            onChange={(event, value) => {
                              model.formikUtang.setFieldValue('_id', value?._id ?? ''); // Set _id
                              model.formikUtang.setFieldValue(
                                'personName',
                                value?.personName ?? ''
                              ); // Set personName
                            }}
                            disablePortal
                            id="combo-box-demo"
                            options={model.allUtangList || []}
                            getOptionLabel={(option: any) => option?.personName}
                            sx={{ width: 300, marginBottom: 2 }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label="Select Name"
                                name="personName"
                                error={
                                  model.formikUtang.touched.personName &&
                                  Boolean(model.formikUtang.errors.personName)
                                }
                                helperText={
                                  model.formikUtang.touched.personName &&
                                  model.formikUtang.errors.personName
                                }
                              />
                            )}
                          />
                          <Box
                            component="a"
                            sx={{
                              width: '100%',
                              textAlign: 'center',
                              cursor: 'pointer',
                              textDecoration: 'underline',
                              color: 'blue',
                              mt: 2,
                              fontSize: '12px',
                            }}
                            onClick={() => actions.setIsOld(false)}
                          >
                            Not found?
                          </Box>
                        </>
                      ) : (
                        <>
                          <TextField
                            fullWidth
                            id="personName"
                            name="personName"
                            label="Input Person Name"
                            value={model.formikUtang.values.personName}
                            onChange={model.formikUtang.handleChange}
                            error={
                              model.formikUtang.touched.personName &&
                              Boolean(model.formikUtang.errors.personName)
                            }
                            helperText={
                              model.formikUtang.touched.personName &&
                              model.formikUtang.errors.personName
                            }
                            margin="normal"
                          />
                          <Box
                            component="a"
                            sx={{
                              width: '100%',
                              textAlign: 'center',
                              cursor: 'pointer',
                              textDecoration: 'underline',
                              color: 'blue',
                              mt: 2,
                              fontSize: '12px',
                            }}
                            onClick={() => actions.setIsOld(true)}
                          >
                            Back
                          </Box>
                        </>
                      )}
                    </Box>
                  </form>
                </>
              )}
              {model.selectedOption === 'partial' && (
                <form onSubmit={model.formikPartial.handleSubmit}>
                  <Box>
                    <TextField
                      type="number"
                      fullWidth
                      id="partialAmount"
                      name="partialAmount"
                      label="Input Cash"
                      margin="normal"
                      value={model.formikPartial.values.partialAmount}
                      onChange={model.formikPartial.handleChange}
                      error={
                        model.formikPartial.touched.partialAmount &&
                        Boolean(model.formikPartial.errors.partialAmount)
                      }
                      helperText={
                        model.formikPartial.touched.partialAmount &&
                        model.formikPartial.errors.partialAmount
                      }
                      sx={{ marginBottom: '10px' }}
                    />
                    <TextField
                      fullWidth
                      type="number"
                      id="desiredAmount"
                      name="desiredAmount"
                      label="Input Partial Amount"
                      value={model.formikPartial.values.desiredAmount}
                      onChange={model.formikPartial.handleChange}
                      error={
                        model.formikPartial.touched.desiredAmount &&
                        Boolean(model.formikPartial.errors.desiredAmount)
                      }
                      helperText={
                        model.formikPartial.touched.desiredAmount &&
                        model.formikPartial.errors.desiredAmount
                      }
                      sx={{ marginBottom: '10px' }}
                    />
                    {model.isOld ? (
                      <>
                        <Autocomplete
                          // value={formikUtang.values.personName}
                          onChange={(event, value) => {
                            model.formikPartial.setFieldValue('_id', value?._id ?? ''); // Set _id
                            model.formikPartial.setFieldValue(
                              'personName',
                              value?.personName ?? ''
                            ); // Set personName
                          }}
                          disablePortal
                          id="combo-box-demo"
                          options={model.allUtangList || []}
                          getOptionLabel={(option: any) => option?.personName}
                          sx={{ width: 300, marginBottom: 2 }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Select Name"
                              name="personName"
                              error={
                                model.formikPartial.touched.personName &&
                                Boolean(model.formikPartial.errors.personName)
                              }
                              helperText={
                                model.formikPartial.touched.personName &&
                                model.formikPartial.errors.personName
                              }
                            />
                          )}
                        />
                        <Box
                          component="a"
                          sx={{
                            width: '100%',
                            textAlign: 'center',
                            cursor: 'pointer',
                            textDecoration: 'underline',
                            color: 'blue',
                            mt: 2,
                            fontSize: '12px',
                          }}
                          onClick={() => actions.setIsOld(false)}
                        >
                          Person not found?
                        </Box>
                      </>
                    ) : (
                      <>
                        <TextField
                          fullWidth
                          id="personName"
                          name="personName"
                          label="Input Person Name"
                          value={model.formikPartial.values.personName}
                          onChange={model.formikPartial.handleChange}
                          error={
                            model.formikPartial.touched.personName &&
                            Boolean(model.formikPartial.errors.personName)
                          }
                          helperText={
                            model.formikPartial.touched.personName &&
                            model.formikPartial.errors.personName
                          }
                        />
                        <Box
                          component="a"
                          sx={{
                            width: '100%',
                            textAlign: 'center',
                            cursor: 'pointer',
                            textDecoration: 'underline',
                            color: 'blue',
                            mt: 2,
                            fontSize: '12px',
                          }}
                          onClick={() => actions.setIsOld(true)}
                        >
                          Back
                        </Box>
                      </>
                    )}
                  </Box>
                </form>
              )}
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: '0px' }}>
            <Box sx={classes.footerButton}>
              <Button
                disabled={model.selectedOption ? false : true}
                onClick={actions.handleProceedClick}
                variant="contained"
                color="primary"
                sx={{
                  width: '100%',
                  height: '80px',
                  fontSize: '20px',
                  fontWeight: 700,
                  '& .MuiButtonBase-root': { borderRadius: 'unset !important' },
                }}
              >
                {model.isLoading ? 'Processing' : `PAY ${formatCurrency(model.total)}`}
              </Button>
            </Box>
          </DialogActions>
        </Dialog>
      </div>
      <Receipts
        setReceiptOpen={actions.setReceiptOpen}
        receiptOpen={model.receiptOpen}
        allItems={model.allItems}
        selectedOption={model.selectedOption}
      />
    </div>
  );
}
