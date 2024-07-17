import { combineReducers } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import authReducer from './auth';
import selectedItemsReducer from './items';
import { authPersistConfig } from '../persist-config';

const rootReducers = combineReducers({
  auth: persistReducer(authPersistConfig, authReducer),
  selectedItems: selectedItemsReducer,
});

export default rootReducers;
