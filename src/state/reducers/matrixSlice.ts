import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { merge } from "lodash";
import { RootState } from "../store/store";

export interface MatrixState {
  opacity_scale: number;
  potential_recluster: {
    distance_metric: string;
    linkage_type: string;
  };
  distance_metric: string;
  linkage_type: string;
}

const defaults = {
  distance_metric: "cosine",
  linkage_type: "average",
};
const initialState: MatrixState = {
  ...defaults,
  opacity_scale: 0.5,
  potential_recluster: {
    ...defaults,
  },
};

export const matrixSlice = createSlice({
  name: "matrix",
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    setMatrixState: (state, action: PayloadAction<MatrixState>) => {
      state = action.payload;
      return state;
    },
    mutateMatrixState: (state, action: PayloadAction<Partial<MatrixState>>) => {
      state = merge(state, action.payload);
      return state;
    },
    setOpacityScale: (
      state,
      action: PayloadAction<MatrixState["opacity_scale"]>
    ) => {
      state.opacity_scale = action.payload;
      return state;
    },
  },
});

export const { setMatrixState, mutateMatrixState, setOpacityScale } =
  matrixSlice.actions;

export const selectMatrixState = (state: RootState) => state.matrix;

export default matrixSlice.reducer;
