import { fetchItems, getAllUtang } from '@/src/common/api/testApi';
import { getData, setData } from '@/src/common/reducers/data';
import {
  addItem,
  deleteItem,
  getSelectedItems,
  removeItem,
  updateItemQuantity,
} from '@/src/common/reducers/items';
import { setUtangData } from '@/src/common/reducers/utangData';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

export default function useViewModel() {
  const { items } = useSelector(getSelectedItems);
  const [quantity, setQuantity] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeOrders, setActiveOrders] = useState({});
  const [isEdit, setIsEdit] = useState(false);
  const dispatch = useDispatch();
  const state = useSelector(getData);
  const [open, setOpen] = useState(false);
  const [itemToDelete2, setItemToDelete] = useState('');
  const [deleteProduct, setDeleteProduct] = useState('');
  const [autocompleteValue, setAutocompleteValue] = useState(null);
  const [allItems, setAllItems] = useState([]);
  const [refetch, setRefetch] = useState(false);
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

  const fetItems = async () => {
    try {
      const itemsData = await fetchItems();
      setAllItems(itemsData);
      dispatch(setData(itemsData));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetItems();
  }, [refetch]);

  useEffect(() => {
    setAllItems(state);
  }, [state, refetch]);

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
        setAutocompleteValue(null);
        handleOpen(true);
        //dispatch(addItem({ id: value.id, name: value.name, price: value.price, _id: value._id }));
      }
    }
  };

  const handleConfirm = () => {
    dispatch(deleteItem(itemToDelete2));
    handleClose();
    setItemToDelete('');
    setItemToDelete('');
  };

  const handleDeleteItem = (id, name) => {
    setOpen(true);
    setDeleteProduct(name);
    setItemToDelete(id);
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

  const handleIncreaseQuantity = (id) => {
    console.log('quantity', quantity);
    setQuantity((prevQuantity) => prevQuantity + 1);
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

  const handleIncrement = () => {
    if (isEdit) {
      handleIncreaseQuantity(activeOrders.id);
    } else {
      setQuantity((prevQuantity) => prevQuantity + 1);
    }
  };

  const handleDecrement = () => {
    if (isEdit) {
      handleDecreaseQuantity(activeOrders.id);
    }
    if (quantity > 1) {
      setQuantity((prevQuantity) => (prevQuantity > 1 ? prevQuantity - 1 : 1));
    }
  };

  const handleChange = (value) => {
    setQuantity(value);
  };

  const handleOpen = () => {
    setModalOpen(true);
  };

  const handleCloseQty = () => {
    setModalOpen(false);
  };

  const handleConfirmQty = () => {
    const newData = {
      id: activeOrders.id,
      name: activeOrders.name,
      price: activeOrders.price,
      quantity: quantity,
      total: activeOrders.price * quantity,
      _id: activeOrders._id,
    };
    if (isEdit) {
      setModalOpen(false);
      setQuantity(1);
      setIsEdit(false);
    } else {
      dispatch(addItem(newData));
      setModalOpen(false);
      setQuantity(1);
      setIsEdit(false);
    }
  };

  const handleCancel = () => {
    setModalOpen(false);
    setQuantity(1);
  };

  const handleEditItem = (data) => {
    setIsEdit(true);
    setActiveOrders(data);
    setQuantity(data.quantity);
    handleOpen();
  };

  useEffect(() => {
    console.log(quantity);
  }, [quantity]);

  return {
    handleIncrement,
    handleDecrement,
    handleChange,
    handleOpen,
    handleCloseQty,
    handleConfirmQty,
    handleCancel,
    activeOrders,
    setActiveOrders,
    quantity,
    modalOpen,
    open,
    handleEditItem,
    setIsEdit,
    onNewScanResult,
    allItems,
    handleAddItem,
    handleDeleteItem,
    handleConfirm,
    items,
    handleClose,
    itemToDelete2,
    deleteProduct,
    autocompleteValue,
    setRefetch,
  };
}
