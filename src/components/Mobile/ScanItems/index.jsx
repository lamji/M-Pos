/* eslint-disable react-hooks/exhaustive-deps */
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
import BarcodeScannerComponent from '../../wt2Scanner/index';
import LinearIndeterminate from '../../Loader/linear';
import DeleteConfirmationDialog from '../DeleteModal';
import QuantityAdjuster from '../QtyConfrimatoin';
import useViewModel from './useViewModel';

const ComboBox = () => {
  const {
    handleIncrement,
    handleDecrement,
    handleChange,
    // handleOpen,
    handleCloseQty,
    handleClose,
    itemToDelete2,
    handleConfirmQty,
    handleCancel,
    activeOrders,
    // setActiveOrders,
    quantity,
    modalOpen,
    open,
    handleEditItem,
    // setIsEdit,
    onNewScanResult,
    allItems,
    handleAddItem,
    handleDeleteItem,
    handleConfirm,
    items,
  } = useViewModel();

  return (
    <>
      {allItems ? (
        <>
          <Box
            sx={{
              padding: '20px',
              paddingBottom: '60px',
              borderRadius: 10,
              background: 'white',
              marginTop: '-200px',
              paddingTop: '20px',
            }}
          >
            {/* Conditionally render the Html5QrcodePlugin based on isScanning state */}

            {/* {isScanning && (
          <Html5QrcodePlugin
            fps={10}
            qrbox={250}
            disableFlip={false}
            qrCodeSuccessCallback={debouncedOnNewScanResult}
            stopScanning={stopScanning} // Pass the stopScanning state as a prop
          />
        )} */}

            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Autocomplete
                disablePortal
                id="combo-box-demo"
                options={allItems}
                disabled={allItems.length === 0}
                getOptionLabel={(option) => option.name}
                sx={{
                  width: '100%',
                  '& .MuiAutocomplete-endAdornment': {
                    display: 'none',
                  },
                  '& .MuiAutocomplete-inputRoot': {
                    padding: '10px !important',
                    borderRadius: '4px', // Optional: Add border radius
                    '&:hover': {
                      borderColor: '#888', // Change border color on hover
                    },
                  },
                }}
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
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <Typography variant="body2" mr={1}>
                        {option.name} -
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {formatCurrency(option.price)}
                      </Typography>
                    </div>
                  </MenuItem>
                )}
              />
              <Box sx={{ marginTop: '50px', marginLeft: '20px' }}>
                <BarcodeScannerComponent dataOut={(data) => onNewScanResult(data)} size={50} />
              </Box>
            </Box>

            <List sx={{ marginTop: '0px', height: '50vh', overflow: 'scroll' }}>
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
                        <Typography fontSize={'10px'} fontWeight={700}>{`${item.name}`}</Typography>
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
            <ToastContainer />
            <DeleteConfirmationDialog
              open={open}
              onClose={handleClose}
              onConfirm={handleConfirm}
              item={itemToDelete2}
            />
          </Box>
          {/* <Button variant="contained" color="primary" onClick={handleOpen}>
            Adjust Quantity
          </Button> */}

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
          />
        </>
      ) : (
        <>
          <LinearIndeterminate />
        </>
      )}
    </>
  );
};

export default ComboBox;
