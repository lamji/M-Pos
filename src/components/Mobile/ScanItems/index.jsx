/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
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
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import { useDispatch, useSelector } from 'react-redux';
import { getSelectedItems, removeItem } from '@/src/common/reducers/items';
import { formatCurrency } from '@/src/common/helpers';
import { getData, setData } from '@/src/common/reducers/data';
import { getAllUtang } from '@/src/common/api/testApi';
import { setUtangData } from '@/src/common/reducers/utangData';
import BarcodeScannerComponent from '../../wt2Scanner/index';
import Swal from 'sweetalert2';
import LinearIndeterminate from '../../Loader/linear';
import DeleteConfirmationDialog from '../DeleteModal';
import QuantityAdjuster from '../QtyConfrimatoin';
import useViewModel from './useViewModel';

const ComboBox = () => {
  const {
    handleIncrement,
    handleDecrement,
    handleChange,
    handleOpen,
    handleCloseQty,
    handleConfirmQty,
    handleCancel,
    quantity,
    modalOpen,
    activeOrders,
    setActiveOrders,
    handleEditItem,
  } = useViewModel();
  const dispatch = useDispatch();
  const { items } = useSelector(getSelectedItems);
  const state = useSelector(getData);
  const [open, setOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState('');
  const [itemToDeleteId, setItemToDeleteId] = useState('');

  const [allItems, setAllItems] = useState([]);
  // const [lastScan, setLastScan] = useState(0);
  // const [isScanning, setIsScanning] = useState(false); // State to manage scanner visibility

  // const [jsonResponse, setJsonResponse] = useState(null); // State to hold the API response

  const handleClose = () => {
    setOpen(false);
    setItemToDelete(null);
  };

  // Initialize Audio only on the client side
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Preload the sound effect
      const scanSuccessSound = new Audio('/scan-success.mp3');
      scanSuccessSound.preload = 'auto';
      scanSuccessSound.load(); // Ensure the sound is loaded and ready to play
      window.SCAN_SUCCESS_SOUND = scanSuccessSound;
    }
  }, []);

  useEffect(() => {
    fetch('/api/items2')
      .then((response) => response.json())
      .then((data) => {
        // setAllItems(data);
        dispatch(setData(data));
      })
      .catch((error) => console.error('Error fetching JSON data:', error));
  }, []);

  useEffect(() => {
    setAllItems(state);
  }, [state]);

  // const handleScanClick = () => {
  //   setIsScanning(!isScanning); // Toggle scanning state
  //   console.log('Scan button clicked:', !isScanning ? 'Starting' : 'Stopping');
  // };

  const handleAddItem = (event, value) => {
    if (value) {
      if (value.quantity <= 0) {
        Swal.fire({
          title: 'Error!',
          text: `Item ${value.name} is out of stock`,
          icon: 'error',
          confirmButtonText: 'OK',
        });
      } else {
        setActiveOrders(value);
        handleOpen(true);
        //dispatch(addItem({ id: value.id, name: value.name, price: value.price, _id: value._id }));
      }
    }
  };

  const handleConfirm = () => {
    dispatch(removeItem(itemToDeleteId));
    handleClose();
  };

  const handleDeleteItem = (id, name) => {
    setOpen(true);
    setItemToDelete(name);
    setItemToDeleteId(id);
    // if (confirmed) {
    //   dispatch(removeItem(id));
    // }
  };

  const onNewScanResult = async (decodedText) => {
    // Debounce logic to avoid handling the same scan multiple times

    if (typeof window !== 'undefined' && window.SCAN_SUCCESS_SOUND) {
      try {
        window.SCAN_SUCCESS_SOUND.currentTime = 0; // Reset time to start from the beginning
        window.SCAN_SUCCESS_SOUND.play();
      } catch (error) {
        console.error('Error playing sound', error);
      }
    }

    try {
      const response = await fetch(`/api/items2?barcode=${decodedText}`);
      const data = await response.json();
      // setJsonResponse(data); // Set the JSON response to state

      if (data.length > 0) {
        const matchedItem = data[0];
        if (matchedItem?.quantity <= 0) {
          Swal.fire({
            title: 'Error!',
            text: `Item ${matchedItem.name} is out of stock`,
            icon: 'error',
            confirmButtonText: 'OK',
          });
        } else {
          setActiveOrders(matchedItem);
          handleOpen(true);
        }
      } else {
        toast.error('Barcode not found');
      }
    } catch (error) {
      toast.error('Error fetching item data');
    }
  };

  /**Utang updates */

  const updateUtang = async () => {
    try {
      const data = await getAllUtang();
      if (data) {
        dispatch(setUtangData(data));
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    updateUtang();
  }, [state]);

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
              item={itemToDelete}
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
