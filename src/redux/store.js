import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import rootReducer from './reducers';

const createAsyncStorage = () => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      return {
        getItem: async (key) => {
          try {
            const value = localStorage.getItem(key);
            return value ? JSON.parse(value) : null;
          } catch (error) {
            console.warn('Error getting storage:', error);
            return null;
          }
        },
        setItem: async (key, value) => {
          try {
            localStorage.setItem(key, JSON.stringify(value));
          } catch (error) {
            console.warn('Error setting storage:', error);
          }
        },
        removeItem: async (key) => {
          try {
            localStorage.removeItem(key);
          } catch (error) {
            console.warn('Error removing storage:', error);
          }
        },
      };
    }
    return {
      getItem: async () => null,
      setItem: async () => {},
      removeItem: async () => {},
    };
  } catch {
    return {
      getItem: async () => null,
      setItem: async () => {},
      removeItem: async () => {},
    };
  }
};

const storage = createAsyncStorage();

const persistConfig = {
  key: 'root',
  storage: storage,
  whitelist: ['auth']
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
        ignoredPaths: ['register']
      }
    })
});

export const persistor = persistStore(store);