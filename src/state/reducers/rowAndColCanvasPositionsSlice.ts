import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type RowAndColCanvasPositions = {
  x_arr: number[];
  y_arr: number[];
};

const initialState: RowAndColCanvasPositions = {} as RowAndColCanvasPositions;

export const categoriesSlice = createSlice({
  name: "rowAndColCanvasPositions",
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    setRowAndColCanvasPositions: (
      state,
      action: PayloadAction<RowAndColCanvasPositions>
    ) => {
      state = action.payload;
      return state;
    },
  },
});

export const { setRowAndColCanvasPositions } = categoriesSlice.actions;

export default categoriesSlice.reducer;
