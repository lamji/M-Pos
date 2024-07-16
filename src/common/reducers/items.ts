import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SelectedItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface SelectedItemsState {
  items: SelectedItem[];
  total: number;
  isBackDropOpen: boolean;
}

const initialState: SelectedItemsState = {
  items: [],
  total: 0,
  isBackDropOpen: false,
};

const selectedItemsSlice = createSlice({
  name: 'selectedItems',
  initialState,
  reducers: {
    setIsBackDropOpen: (state, action) => ({
      ...state,
      isBackDropOpen: action.payload,
    }),
    addItem: (state, action: PayloadAction<{ id: string; name: string; price: number }>) => {
      const { id, name, price } = action.payload;
      const existingItem = state.items.find((item) => item.id === id);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ id, name, price, quantity: 1 });
      }
      state.total += price;
    },
    removeItem: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      const item = state.items.find((item) => item.id === id);
      if (item) {
        state.total -= item.price * item.quantity;
        state.items = state.items.filter((item) => item.id !== id);
      }
    },
    updateItemQuantity: (state, action: PayloadAction<{ id: string; quantity: number }>) => {
      const { id, quantity } = action.payload;
      const item = state.items.find((item) => item.id === id);
      if (item) {
        state.total += item.price * (quantity - item.quantity);
        item.quantity = quantity;
      }
    },
    clearItems: (state) => {
      state.items = [];
      state.total = 0;
    },
  },
});

export const { addItem, removeItem, updateItemQuantity, clearItems, setIsBackDropOpen } =
  selectedItemsSlice.actions;

export const getSelectedItems = (state: any) => state.selectedItems;

export default selectedItemsSlice.reducer;
