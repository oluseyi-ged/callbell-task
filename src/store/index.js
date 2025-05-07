import AsyncStorage from "@react-native-async-storage/async-storage"
import { configureStore } from "@reduxjs/toolkit"
import { combineReducers } from "redux"
import { persistReducer, persistStore } from "redux-persist"
import { contactsApi } from "../api/services/contacts"
import { conversationsApi } from "../api/services/conversations"
import { messagesApi } from "../api/services/messages"
import conversationsReducer from "./conversationsSlice"

const rootReducer = combineReducers({
  [contactsApi.reducerPath]: contactsApi.reducer,
  [conversationsApi.reducerPath]: conversationsApi.reducer,
  conversations: conversationsReducer,
  [messagesApi.reducerPath]: messagesApi.reducer,
})

const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  whitelist: ["conversations"],
  blacklist: [
    contactsApi.reducerPath,
    conversationsApi.reducerPath,
    messagesApi.reducerPath,
  ],
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }).concat(
      contactsApi.middleware,
      conversationsApi.middleware,
      messagesApi.middleware
    ),
})

export const persistor = persistStore(store)
