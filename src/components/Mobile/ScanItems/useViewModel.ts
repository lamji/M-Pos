import {
  addItem,
  getSelectedItems,
  removeItem,
  updateItemQuantity,
} from '@/src/common/reducers/items';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export default function useViewModel() {
  const { items } = useSelector(getSelectedItems);
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeOrders, setActiveOrders] = useState<any>({});
  const [isEdit, setIsEdit] = useState(false);

  const handleIncreaseQuantity = (id: any) => {
    console.log('quantity', quantity);
    setQuantity((prevQuantity) => prevQuantity + 1);
    dispatch(
      updateItemQuantity({
        id,
        quantity: (items.find((item: any) => item.id === id)?.quantity ?? 0) + 1,
      })
    );
  };

  const handleDecreaseQuantity = (id: any) => {
    const quantity = items.find((item: any) => item.id === id)?.quantity ?? 0;
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

  const handleChange = (value: number) => {
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

  const handleEditItem = (data: any) => {
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
    handleEditItem,
    setIsEdit,
  };
}
