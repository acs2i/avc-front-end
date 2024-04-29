import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Family {
  _id: string;
  YX_TYPE: string;
  YX_CODE: string;
  YX_LIBELLE: string;
}

interface FamilyState {
  family: Family | null;
}

const initialState: FamilyState = {
  family: null,
};

export const familySlice = createSlice({
  name: "family",
  initialState,
  reducers: {
    setFamily: (state, action: PayloadAction<Family>) => {
      state.family = action.payload;
    },
    clearFamily: (state) => {
      state.family = null;
    },
  },
});

export const { setFamily, clearFamily } = familySlice.actions;
export default familySlice.reducer;