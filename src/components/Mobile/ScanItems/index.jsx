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
  ListItemSecondaryAction,
  Typography,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import DeleteIcon from '@mui/icons-material/Delete';

import { useDispatch, useSelector } from 'react-redux';
import {
  addItem,
  getSelectedItems,
  removeItem,
  updateItemQuantity,
} from '@/src/common/reducers/items';
import { formatCurrency } from '@/src/common/helpers';
import Nav from '../../Nav';
import { getData, setData } from '@/src/common/reducers/data';
import { getAllUtang } from '@/src/common/api/testApi';
import { setUtangData } from '@/src/common/reducers/utangData';
import BarcodeScannerComponent from '../../wt2Scanner/index';

const ComboBox = () => {
  const dispatch = useDispatch();
  const { items } = useSelector(getSelectedItems);
  const state = useSelector(getData);

  const [allItems, setAllItems] = useState([]);
  // const [lastScan, setLastScan] = useState(0);
  // const [isScanning, setIsScanning] = useState(false); // State to manage scanner visibility

  // const [jsonResponse, setJsonResponse] = useState(null); // State to hold the API response

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
      dispatch(addItem({ id: value.id, name: value.name, price: value.price }));
    }
  };

  const handleIncreaseQuantity = (id) => {
    dispatch(
      updateItemQuantity({
        id,
        quantity: (items.find((item) => item.id === id)?.quantity ?? 0) + 1,
      })
    );
  };

  const handleDecreaseQuantity = (id) => {
    const quantity = items.find((item) => item.id === id)?.quantity ?? 0;
    if (quantity > 1) {
      dispatch(updateItemQuantity({ id, quantity: quantity - 1 }));
    } else {
      dispatch(removeItem(id));
    }
  };

  const handleDeleteItem = (id) => {
    dispatch(removeItem(id));
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
        dispatch(addItem({ id: matchedItem.id, name: matchedItem.name, price: matchedItem.price }));
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
      <Nav>
        {/* <Box display="flex" alignItems="center">
          <IconButton onClick={handleClearItems}>
            <ArrowBackIcon sx={{ color: 'white' }} />
          </IconButton>
          <Typography variant="h6" fontWeight={700}>
            SCAN ITEM
          </Typography>
        </Box> */}
      </Nav>
      <Box
        sx={{
          padding: '20px',
          paddingBottom: '60px',
          position: 'relative',
          borderRadius: 10,
          background: 'white',
          marginTop: '-100px',
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

        <BarcodeScannerComponent dataOut={(data) => onNewScanResult(data)} size={'200px'} />
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
          {/* <Box>
            <IconButton onClick={handleScanClick}>
              <QrCodeScannerIcon style={{ fontSize: '50px' }} />
            </IconButton>
          </Box> */}
        </Box>
        <Typography mt={4} sx={{ marginBottom: '-5px' }} fontWeight={700}>
          Scanned Items
        </Typography>
        <List sx={{ marginTop: '10px', height: '50vh', overflow: 'scroll' }}>
          {items.length > 0 ? (
            items
              .slice()
              .reverse()
              .map((item) => (
                <ListItem key={item.id}>
                  <ListItemText
                    sx={{
                      fontSize: '10px',
                      '& .MuiTypography-root': {
                        fontSize: '10px !important',
                      },
                    }}
                    primary={`${item.name} - ${formatCurrency(item.price)}`}
                    secondary={`Quantity: ${item.quantity}`}
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      onClick={() => handleDecreaseQuantity(item.id)}
                      disabled={item.quantity === 1}
                    >
                      <RemoveCircleIcon color="error" />
                    </IconButton>
                    <IconButton edge="end" onClick={() => handleIncreaseQuantity(item.id)}>
                      <AddCircleIcon color="primary" />
                    </IconButton>
                    <IconButton
                      edge="end"
                      onClick={() => handleDeleteItem(item.id)}
                      sx={{ color: 'error.main' }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
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
      </Box>
    </>
  );
};

export default ComboBox;
