import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SelectedItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  stocks: number;
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

const calculateTotal = (items: SelectedItem[]) => {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
};

const selectedItemsSlice = createSlice({
  name: 'selectedItems',
  initialState,
  reducers: {
    setIsBackDropOpen: (state, action) => {
      state.isBackDropOpen = action.payload;
    },
    addItem: (
      state,
      action: PayloadAction<{
        id: string;
        name: string;
        price: number;
        quantity: number;
        stocks: number;
      }>
    ) => {
      const { id, name, price, quantity, stocks } = action.payload;
      const existingItem = state.items.find((item) => item.id === id);
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.items.push({ id, name, price, quantity, stocks });
      }
      state.total = calculateTotal(state.items);
    },
    removeItem: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      const item = state.items.find((item) => item.id === id);
      if (item && item.quantity > 1) {
        state.items = state.items.filter((item) => item.id !== id);
        state.total = calculateTotal(state.items);
      }
    },
    deleteItem: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      const item = state.items.find((item) => item.id === id);
      if (item) {
        state.items = state.items.filter((item) => item.id !== id);
        state.total = calculateTotal(state.items);
      }
    },
    updateItemQuantity: (state, action: PayloadAction<{ id: string; quantity: number }>) => {
      const { id, quantity } = action.payload;
      const item = state.items.find((item) => item.id === id);
      if (item) {
        item.quantity = quantity;
        state.total = calculateTotal(state.items);
      }
    },
    clearItems: (state) => {
      state.items = [];
      state.total = 0;
    },
  },
});

export const {
  addItem,
  removeItem,
  updateItemQuantity,
  clearItems,
  setIsBackDropOpen,
  deleteItem,
} = selectedItemsSlice.actions;

export const getSelectedItems = (state: any) => state.selectedItems;

export default selectedItemsSlice.reducer;
