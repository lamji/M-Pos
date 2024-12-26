import * as React from 'react';
import Box from '@mui/material/Box';
import {
  Autocomplete,
  Divider,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material';
import CardButton from '../../Mobile/CardButton';

import { formatCurrency, useDeviceType } from '@/src/common/helpers';
import dynamic from 'next/dynamic';
import useViewModel from '../../Mobile/ScanItems/useViewModel';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import { ToastContainer } from 'react-toastify';
import DeleteConfirmationDialog from '../../Mobile/DeleteModal';
import QuantityAdjuster from '../../Mobile/QtyConfrimatoin';
import Checkout from '../../Mobile/CheckOut';

const BarcodeScannerComponent = dynamic(() => import('../../wt2Scanner/index'));

export default function LaptopScanItems() {
  const { isPortrait } = useDeviceType();

  const width = isPortrait ? '100%' : '500px';
  const {
    onNewScanResult,
    allItems,

    autocompleteValue,
    handleAddItem,
    handleInputChange,
    displayedItems,
    items,
    handleEditItem,
    handleDeleteItem,
    open,
    handleClose,
    handleConfirm,
    deleteProduct,
    modalOpen,
    handleCloseQty,
    handleIncrement,
    handleDecrement,
    handleChange,
    quantity,
    handleConfirmQty,
    handleCancel,
    activeOrders,
    stocks,
    handleRefetch,
  } = useViewModel();
  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
        <Box
          sx={{
            width: width,
            background: '#f7f7f7',
            padding: '15px',
            height: '90vh',
            marginTop: '10px',
          }}
        >
          <Box sx={{}}>
            <Typography fontWeight={700} mx={2} fontSize="25px">
              Transactions
            </Typography>
            {isPortrait && (
              <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', marginTop: '15px' }}>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={displayedItems}
                  value={autocompleteValue}
                  disabled={allItems.length === 0}
                  getOptionLabel={(option: any) => option.name}
                  sx={{
                    width: '100%',
                    background: 'white',
                    borderRadius: '4px',
                    '& .MuiAutocomplete-endAdornment': {
                      display: 'none',
                    },
                    '& .MuiAutocomplete-inputRoot': {
                      padding: '10px !important',
                      borderRadius: '4px',
                      '&:hover': {
                        borderColor: '#888',
                      },
                    },
                  }}
                  onInputChange={handleInputChange}
                  onChange={handleAddItem}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Search Item"
                      // InputLabelProps={{ shrink: false }}
                      size="small"
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {params.InputProps.endAdornment}
                            <InputAdornment position="end">
                              <IconButton>
                                <SearchIcon />
                              </IconButton>
                            </InputAdornment>
                          </>
                        ),
                      }}
                    />
                  )}
                  renderOption={(props, option) => (
                    <MenuItem {...props}>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          width: '100%',
                        }}
                      >
                        <Box>
                          <Typography fontSize={'12px'} variant="body2" mr={1} fontWeight={700}>
                            {option.name}
                          </Typography>
                          <Typography
                            fontSize={'12px'}
                            sx={{ color: option.quantity > 0 ? 'green' : 'red' }}
                            variant="body2"
                            mr={1}
                          >
                            Stocks:{option.quantity}
                          </Typography>
                        </Box>
                        <Typography fontSize={'12px'} variant="body2" color="textSecondary">
                          {formatCurrency(option.price)}
                        </Typography>
                      </Box>
                    </MenuItem>
                  )}
                />
                <Box sx={{ marginLeft: '20px' }}>
                  <BarcodeScannerComponent
                    dataOut={(data: any) => onNewScanResult(data)}
                    size={50}
                    color={'#000000'}
                  />
                  {/* <Html5QrcodePlugin
                  fps={10}
                  qrbox={250}
                  disableFlip={false}
                  qrCodeSuccessCallback={(decodedText) => onNewScanResult(decodedText)}
                /> */}
                </Box>
              </Box>
            )}
            <Box sx={{ borderRadius: '50px 50px 0 0', marginTop: '10px' }}>
              <List
                sx={{
                  backgroundColor: 'white',
                  marginTop: '0px',
                  height: '63vh',
                  overflow: 'scroll',
                  padding: '30px 20px',
                }}
              >
                {items.length > 0 ? (
                  items
                    .slice()
                    .reverse()
                    .map((item: any) => (
                      <Box
                        key={item.id}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          width: '98%',
                          margin: '0 auto',
                          background: '#f7f7f7',
                          padding: '5px',
                          mb: '3px',
                          borderRadius: '10px',
                        }}
                      >
                        <Box sx={{ width: '130px' }}>
                          <Typography
                            fontSize={'10px'}
                            fontWeight={700}
                          >{`${item.name}`}</Typography>
                          <Typography fontSize={'9px'} fontWeight={700}>{`${formatCurrency(
                            item.price
                          )}`}</Typography>
                          <Typography
                            color={'gray'}
                            fontSize={'10px'}
                          >{`Quantity: ${item.quantity}`}</Typography>
                        </Box>
                        <Box>
                          <Typography fontSize={'12px'}>
                            {formatCurrency(item.price * item.quantity)}
                          </Typography>
                        </Box>
                        <Box sx={{ textAlign: 'right', p: '5px' }}>
                          <IconButton
                            edge="end"
                            onClick={() => handleEditItem(item)}
                            sx={{ color: 'primary.main' }}
                          >
                            <EditIcon sx={{ fontSize: '19px' }} />
                          </IconButton>
                          <IconButton
                            edge="end"
                            onClick={() => handleDeleteItem(item.id, item.name)}
                            sx={{ color: 'error.main', ml: '20px' }}
                          >
                            <CloseIcon sx={{ fontSize: '19px' }} />
                          </IconButton>
                        </Box>
                      </Box>
                    ))
                ) : (
                  <ListItem>
                    <ListItemText
                      primary={<Typography color="textSecondary">No items added yet.</Typography>}
                    />
                  </ListItem>
                )}
              </List>
            </Box>
          </Box>
          {isPortrait && (
            <>
              <Divider sx={{}} />
              <Typography px={1}>Actions</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Checkout isRefresh={(i: any) => handleRefetch(i)} />

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
            </>
          )}
        </Box>
        <Box id="right" sx={{ width: `calc(100% - ${width})` }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'start',
              justifyContent: 'start',
              height: isPortrait ? '10vh' : '70vh',
              width: '100%',
              padding: '20px',
            }}
          >
            {!isPortrait && (
              <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', marginTop: '10px' }}>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={displayedItems}
                  value={autocompleteValue}
                  disabled={allItems.length === 0}
                  getOptionLabel={(option: any) => option.name}
                  sx={{
                    width: '100%',
                    background: 'white',
                    borderRadius: '4px',
                    '& .MuiAutocomplete-endAdornment': {
                      display: 'none',
                    },
                    '& .MuiAutocomplete-inputRoot': {
                      padding: '10px !important',
                      borderRadius: '4px',
                      '&:hover': {
                        borderColor: '#888',
                      },
                    },
                  }}
                  onInputChange={handleInputChange}
                  onChange={handleAddItem}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Search Item"
                      // InputLabelProps={{ shrink: false }}
                      size="small"
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {params.InputProps.endAdornment}
                            <InputAdornment position="end">
                              <IconButton>
                                <SearchIcon />
                              </IconButton>
                            </InputAdornment>
                          </>
                        ),
                      }}
                    />
                  )}
                  renderOption={(props, option) => (
                    <MenuItem {...props}>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          width: '100%',
                        }}
                      >
                        <Box>
                          <Typography fontSize={'12px'} variant="body2" mr={1} fontWeight={700}>
                            {option.name}
                          </Typography>
                          <Typography
                            fontSize={'12px'}
                            sx={{ color: option.quantity > 0 ? 'green' : 'red' }}
                            variant="body2"
                            mr={1}
                          >
                            Stocks:{option.quantity}
                          </Typography>
                        </Box>
                        <Typography fontSize={'12px'} variant="body2" color="textSecondary">
                          {formatCurrency(option.price)}
                        </Typography>
                      </Box>
                    </MenuItem>
                  )}
                />
                <Box sx={{ marginLeft: '20px' }}>
                  <BarcodeScannerComponent
                    dataOut={(data: any) => onNewScanResult(data)}
                    size={50}
                    color={'#000000'}
                  />
                  {/* <Html5QrcodePlugin
                  fps={10}
                  qrbox={250}
                  disableFlip={false}
                  qrCodeSuccessCallback={(decodedText) => onNewScanResult(decodedText)}
                /> */}
                </Box>
              </Box>
            )}
          </Box>

          {!isPortrait && (
            <>
              <Divider sx={{}} />
              <Typography px={1}>Keyboard shortcuts</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Checkout isRefresh={(i: any) => handleRefetch(i)} />

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
            </>
          )}
        </Box>
      </Box>
      <ToastContainer />
      <DeleteConfirmationDialog
        open={open}
        onClose={handleClose}
        onConfirm={handleConfirm}
        item={deleteProduct}
      />

      <QuantityAdjuster
        open={modalOpen}
        handleClose={handleCloseQty}
        onIncrement={handleIncrement}
        onDecrement={handleDecrement}
        onChange={handleChange}
        quantity={quantity}
        onConfirm={handleConfirmQty}
        onCancel={handleCancel}
        items={activeOrders}
        stocks={stocks}
      />
    </Box>
  );
}
