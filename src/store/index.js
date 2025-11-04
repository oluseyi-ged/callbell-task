import AsyncStorage from '@react-native-async-storage/async-storage';
import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import { persistReducer, persistStore, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import { contactsApi } from '../api/services/contacts';
import { conversationsApi } from '../api/services/conversations';
import { messagesApi } from '../api/services/messages';
import conversationsReducer from './conversationsSlice';

const rootReducer = combineReducers({
  [contactsApi.reducerPath]: contactsApi.reducer,
  [conversationsApi.reducerPath]: conversationsApi.reducer,
  conversations: conversationsReducer,
  [messagesApi.reducerPath]: messagesApi.reducer,
});

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['conversations'],
  version: 1,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
      immutableCheck: __DEV__ ? { warnAfter: 128 } : false,
    }).concat(
      contactsApi.middleware,
      conversationsApi.middleware,
      messagesApi.middleware
    ),
  devTools: __DEV__,
});

export const persistor = persistStore(store);
