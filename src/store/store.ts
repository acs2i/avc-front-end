import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
  id: number;
  username: string;
  email: string;
}

interface Token {
  access_token: string;
  refresh_token: string;
}

interface AuthState {
  user: User | null;
  token: Token | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLogin: (state, action: PayloadAction<{ user: User; token: Token }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    setLogout: (state) => {
      state.user = null;
      state.token = null;
    },
  },
});


export const {
    setLogin,
    setLogout
} = authSlice.actions;

export default authSlice.reducer;
