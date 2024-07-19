import storage from 'redux-persist/lib/storage';

export const authPersistConfig = {
  key: 'auth',
  storage,
  whitelist: ['user'],
};

export const itemsPersistConfig = {
  key: 'items',
  storage,
  whitelist: ['user'],
};

export const dataPersistConfig = {
  key: 'data',
  storage,
  whitelist: ['data'],
};

export const utangDataPersistConfig = {
  key: 'utangDataSlice',
  storage,
  whitelist: ['utangData'],
};

// export const receiptPersistConfig = {
//   key: 'receipt',
//   storage,
//   whitelist: ['filter'],
// };

// export const navigationPersistConfig = {
//   key: 'navigation',
//   storage,
//   whitelist: ['selectedHeader', 'selectedMenu'],
// };
