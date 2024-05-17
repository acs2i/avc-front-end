import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import authReducer from "./store/authSlice";
import familyReducer from "./store/familySlice";
import { combineReducers } from "redux";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import { PersistPartial } from "redux-persist/es/persistReducer";
import storage from "redux-persist/lib/storage";
import { PersistGate } from "redux-persist/integration/react";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import QueryProvider from "./utils/providers/QueryProvider";

const persistConfig = {
  key: "root",
  storage,
  version: 1,
};

interface RootState {
  auth: any & PersistPartial;
  family: any & PersistPartial;
}

const rootReducer = combineReducers({
  auth: authReducer,
  family: familyReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false,
    }),
});

export type AppDispatch = typeof store.dispatch;

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistStore(store)}>
      <QueryProvider>
        <BrowserRouter>
          <ToastContainer />
          <App />
        </BrowserRouter>
      </QueryProvider>
    </PersistGate>
  </Provider>
);
