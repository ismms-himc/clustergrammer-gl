import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { merge } from "lodash";

export type GeneDatum = {
  name: string;
  description: string;
};

export interface HzomeState {
  gene_data: Record<string, GeneDatum>;
}

const initialState: HzomeState = {
  gene_data: {},
};

export const hzomeSlice = createSlice({
  name: "hzome",
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    mutateHzomeGeneData: (state, action: PayloadAction<HzomeState>) => {
      state.gene_data = merge(state.gene_data, action.payload);
      return state;
    },
  },
});

export const { mutateHzomeGeneData } = hzomeSlice.actions;

export default hzomeSlice.reducer;
