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
  Button,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import { formatCurrency } from '@/src/common/helpers';
import LinearIndeterminate from '../../Loader/linear';
import DeleteConfirmationDialog from '../DeleteModal';
import useViewModel from './useViewModel';
import dynamic from 'next/dynamic';
import Fab from "@mui/material/Fab";
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import { useScanItemsStyles } from './useStyles';


import Html5QrcodePlugin from '../../Scanner/index';

const Checkout = dynamic(() => import('../CheckOut/index'));
const BarcodeScannerComponent = dynamic(() => import('../../wt2Scanner/index'));
const QuantityAdjuster = dynamic(() => import('../QtyConfrimatoin'));

const ComboBox = () => {
  const styles = useScanItemsStyles()
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
    // searchOpen,
    showWebQr,
    setSearchOpen
  } = useViewModel();

  return (
    <>
      {allItems ? (
        <>
          <Box
            sx={{
              borderRadius: 10,
              background: 'white',
              height: "90vh",
              paddingBottom: "100px", // 👈 space for FAB
            }}
          >
            <Box>
              <Box sx={{
                width: "100%",
                padding: "20px"
              }}>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={displayedItems}
                  value={autocompleteValue}
                  disabled={allItems.length === 0}
                  getOptionLabel={(option: any) => option?.name}
                  sx={{
                    zIndex: 99999,
                    position: "absolute",
                    width: '90%',
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
                      InputLabelProps={{ shrink: false }}
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
                  {showWebQr && (<Html5QrcodePlugin
                    fps={10}
                    qrbox={250}
                    disableFlip={false}
                    qrCodeSuccessCallback={(decodedText: any) => onNewScanResult(decodedText)}
                  />)}
                </Box>
              </Box>


            </Box>

            <Box sx={styles.boxList}>
              <List sx={styles.listWrapper} >
                {items.length > 0 ? (
                  items
                    .slice()
                    .reverse()
                    .map((item: any) => (
                      <Box
                        key={item.id}
                        sx={styles.boxItems}
                      >
                        <Box sx={{ width: '130px' }}>
                          <Typography
                            fontSize={'10px'}
                            fontWeight={700}
                          >{`${item.name}`}</Typography>
                          <Typography fontSize={'9px'} fontWeight={700}>{`${formatCurrency(
                            item.price
                          )}`}</Typography>
                          <Typography sx={styles.itemQuantity}>
                            {`Quantity: ${item.quantity}`}
                          </Typography>
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
                  <ListItem sx={styles.emptyListItems} >
                    <ListItemText
                      primary={
                        <Typography color="textSecondary">
                          No items added yet, use scan or search.
                        </Typography>
                      }
                    />
                  </ListItem>

                )}
              </List>
            </Box>

            <ToastContainer />
            <DeleteConfirmationDialog
              open={open}
              onClose={handleClose}
              onConfirm={handleConfirm}
              item={deleteProduct}
            />
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
        </>
      ) : (
        <LinearIndeterminate />
      )}

      <Box sx={styles.fabBox}>
        <Fab sx={styles.fab} >
          <Button startIcon={<ManageSearchIcon style={{ fontSize: "30px" }} />} onClick={() => setSearchOpen(true)} />
        </Fab>

        <Fab sx={styles.fab} >
          <BarcodeScannerComponent
            color="black"
            dataOut={(data: any) => onNewScanResult(data)}
            size={50}
          />
        </Fab>

        <Fab sx={styles.fab} >
          <Box sx={{ textAlign: 'center' }}>
            <Checkout isRefresh={(i) => handleRefetch(i)} />
          </Box>
        </Fab>
      </Box>
    </>
  );
};

export default ComboBox;
