import { createSlice } from '@reduxjs/toolkit';
import { IAuth } from '../types/auth';
import { TRootState } from '../app/store';

const initialState: IAuth = {
  user: undefined,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUserDetails: (state, action) => ({
      ...state,
      user: action.payload,
    }),
  },
});

export const { setUserDetails } = authSlice.actions;
export const getAuth = (state: TRootState) => state.auth as IAuth;
export default authSlice.reducer;
