import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type NodeCanvasPos = {
  x_arr: number[];
  y_arr: number[];
};

const initialState: NodeCanvasPos = {} as NodeCanvasPos;

export const categoriesSlice = createSlice({
  name: "node_canvas_pos",
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    setNodeCanvasPos: (state, action: PayloadAction<NodeCanvasPos>) => {
      state = action.payload;
      return state;
    },
  },
});

export const { setNodeCanvasPos } = categoriesSlice.actions;

export default categoriesSlice.reducer;
