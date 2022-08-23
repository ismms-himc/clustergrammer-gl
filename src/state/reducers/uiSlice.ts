import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store/store";

export interface UIState {}

const initialState: UIState = {};

export const uiSlice = createSlice({
  name: "ui",
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    setUI: (state, action: PayloadAction<UIState>) => {
      state = action.payload;
      return state;
    },
  },
});

export const { setUI } = uiSlice.actions;

export const selectUIState = (state: RootState) => state.ui;

export default uiSlice.reducer;
