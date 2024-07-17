import { configureStore, ThunkAction, Action, Tuple } from '@reduxjs/toolkit';

import monitorReducersEnhancer from './enhancers/monitorReducers';

import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';
import reducers from '../reducers';
import logger from './/middleware/logger';

const rootPersistConfig = {
  key: 'root',
  storage: storage,
  whitelist: [],
};

const persistedReducer = persistReducer(rootPersistConfig, reducers);

export const store: any = configureStore({
  reducer: persistedReducer,
  middleware: () => new Tuple(logger),
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  enhancers: (getDefaultEnhancers) => getDefaultEnhancers().concat(monitorReducersEnhancer),
});

export const persistor = persistStore(store);

export type TAppDispatch = typeof store.dispatch;
export type TRootState = ReturnType<typeof store.getState>;
export type TAppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  TRootState,
  unknown,
  Action<string>
>;
