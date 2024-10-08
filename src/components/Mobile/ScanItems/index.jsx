import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import {
  Box,
  InputAdornment,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Typography,
  MenuItem,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import { formatCurrency } from '@/src/common/helpers';
import LinearIndeterminate from '../../Loader/linear';
import DeleteConfirmationDialog from '../DeleteModal';
import useViewModel from './useViewModel';
import dynamic from 'next/dynamic';

const Checkout = dynamic(() => import('../CheckOut/index'));
const BarcodeScannerComponent = dynamic(() => import('../../wt2Scanner/index'));
const QuantityAdjuster = dynamic(() => import('../QtyConfrimatoin'));

const ComboBox = () => {
  const {
    handleIncrement,
    handleDecrement,
    handleChange,
    handleCloseQty,
    handleClose,
    deleteProduct,
    handleConfirmQty,
    handleCancel,
    activeOrders,
    quantity,
    modalOpen,
    open,
    handleEditItem,
    onNewScanResult,
    allItems,
    handleAddItem,
    handleDeleteItem,
    handleConfirm,
    items,
    autocompleteValue,
    handleRefetch,
    handleInputChange,
    displayedItems,
    stocks,
    isMobile,
    isLarge,
  } = useViewModel();

  return (
    <>
      {allItems ? (
        <>
          <Box
            sx={{
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Box
              sx={{
                paddingBottom: '50px',
                borderRadius: '5px 5px 5px 5px',
                background: 'white',
                marginTop: '-200px',
                padding: '10px',
              }}
            >
              {isMobile && (
                <>
                  <Box sx={{ textAlign: 'center' }}>
                    <Checkout isRefresh={(i) => handleRefetch(i)} />
                  </Box>
                </>
              )}
              <Box sx={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={displayedItems}
                  value={autocompleteValue}
                  disabled={allItems.length === 0}
                  getOptionLabel={(option) => option.name}
                  sx={{
                    width: '100%',
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
                {isMobile && (
                  <Box sx={{ marginTop: '50px', marginLeft: '20px' }}>
                    <BarcodeScannerComponent dataOut={(data) => onNewScanResult(data)} size={50} />
                  </Box>
                )}
              </Box>
              <List sx={{ marginTop: '10px', height: 'calc(100vh - 350px)', overflowY: 'scroll' }}>
                {items.length > 0 ? (
                  items
                    .slice()
                    .reverse()
                    .map((item) => (
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
            <Box sx={{ height: '150px' }}>
              {isLarge && (
                <>
                  <Box sx={{ textAlign: 'center' }}>
                    <Checkout isRefresh={(i) => handleRefetch(i)} />
                  </Box>
                </>
              )}
            </Box>
          </Box>

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
          <ToastContainer />
          <DeleteConfirmationDialog
            open={open}
            onClose={handleClose}
            onConfirm={handleConfirm}
            item={deleteProduct}
          />
        </>
      ) : (
        <LinearIndeterminate />
      )}
    </>
  );
};

export default ComboBox;
