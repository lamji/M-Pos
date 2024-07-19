import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: any = {
  utangData: [],
};

const utangDataSlice = createSlice({
  name: 'utangDataSlice',
  initialState,
  reducers: {
    setUtangData: (state, action: PayloadAction<any[]>) => {
      state.utangData = action.payload;
    },
    addItem: (state, action: PayloadAction<any>) => {
      state.data.push(action.payload);
    },
    clearData: (state) => {
      state.data = [];
    },
  },
});

export const { setUtangData, addItem, clearData } = utangDataSlice.actions;

export const getUtangData = (state: any) => state.utangData.utangData;

export default utangDataSlice.reducer;
