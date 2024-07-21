import { combineReducers } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import authReducer from './auth';
import selectedItemsReducer from './items';
import dataReducer from './data';
import utangReducer from './utangData';
import {
  authPersistConfig,
  dataPersistConfig,
  utangDataPersistConfig,
  itemsPersistConfig,
} from '../persist-config';

const rootReducers = combineReducers({
  auth: persistReducer(authPersistConfig, authReducer),
  data: persistReducer(dataPersistConfig, dataReducer),
  utangData: persistReducer(utangDataPersistConfig, utangReducer),
  selectedItems: persistReducer(itemsPersistConfig, selectedItemsReducer),
});

export default rootReducers;
