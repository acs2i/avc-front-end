// store.ts
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import familyReducer from "./familySlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    family: familyReducer,
  },
});

export default store;