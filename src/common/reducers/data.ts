import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Item {
  _id: string;
  id: string;
  name: string;
  price: number;
  barcode: string;
  __v: number;
}

interface DataState {
  data: Item[];
}

const initialState: DataState = {
  data: [],
};

const dataSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {
    setData: (state, action: PayloadAction<Item[]>) => {
      state.data = action.payload;
    },
    addItem: (state, action: PayloadAction<Item>) => {
      state.data.push(action.payload);
    },
    clearData: (state) => {
      state.data = [];
    },
  },
});

export const { setData, addItem, clearData } = dataSlice.actions;

export const getData = (state: any) => state.data.data;

export default dataSlice.reducer;
