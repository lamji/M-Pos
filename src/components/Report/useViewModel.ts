import { setIsBackDropOpen } from '@/src/common/reducers/items';
import { useState } from 'react';
import { useDispatch } from 'react-redux';

export default function useViewModel() {
  const dispatch = useDispatch();
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const handleGroceryListClick = () => {
    setIsFilterOpen(true);
  };

  const handleFilterModalClose = () => {
    setIsFilterOpen(false);
  };

  const handleFilterConfirm = (i: any) => {
    try {
      dispatch(setIsBackDropOpen(true));
      setTimeout(() => {
        dispatch(setIsBackDropOpen(false));
        console.log('Form Submitted', i);
        alert(JSON.stringify(i));
      }, 2000);
    } catch (error) {
      alert(JSON.stringify(error));
    }
  };
  return {
    handleGroceryListClick,
    isFilterOpen,
    handleFilterModalClose,
    handleFilterConfirm,
  };
}
