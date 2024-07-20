import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: any = {
  utangData: [],
  payment: {
    name: '', // Payor's name
    amount: 0, // Payment amount
    id: '',
  },
  totalUtang: 0,
};

const utangDataSlice = createSlice({
  name: 'utangDataSlice',
  initialState,
  reducers: {
    setUtangData: (state, action: PayloadAction<any[]>) => {
      state.utangData = action.payload;
    },
    addItem: (state, action: PayloadAction<any>) => {
      state.utangData.push(action.payload);
    },
    clearData: (state) => {
      state.utangData = [];
    },
    setPayment: (state, action: PayloadAction<{ name: string; amount: number; id: string }>) => {
      state.payment = action.payload;
    },
    setUtangTotal: (state, action: any) => {
      state.totalUtang = action.payload;
    },
    clearPayment: (state) => {
      state.payment = { name: '', amount: 0 };
    },
  },
});

export const { setUtangData, addItem, clearData, setPayment, clearPayment, setUtangTotal } =
  utangDataSlice.actions;

export const getUtangData = (state: any) => state.utangData.utangData;
export const getPayment = (state: any) => state.utangData.payment;

export default utangDataSlice.reducer;
