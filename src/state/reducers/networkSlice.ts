import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { merge } from "lodash";
import { NetworkData, Ordering } from "../../types/network";

export type NormScoring = "zscored" | "non-zscored";

export interface NetworkState extends NetworkData {
  [x: string]: any;
  order: {
    row: Ordering;
    col: Ordering;
  };
  pre_zscore: {
    mean: number[];
    std: number[];
  };
  mat_iz: NetworkData["mat"];
  row_node_names: string[];
  col_node_names: string[];
  cat_colors: Record<string, any>;
  norm?: {
    initial_status: NormScoring;
    zscore_status: NormScoring;
  };
}

const initialState: NetworkState = {
  order: {
    row: "clust",
    col: "clust",
  },
  pre_zscore: {
    mean: [],
    std: [],
  },
  mat: [],
  mat_iz: [],
  row_nodes: [],
  col_nodes: [],
  views: [],
  row_node_names: [],
  col_node_names: [],
  cat_colors: [],
};

export const networkSlice = createSlice({
  name: "network",
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    setNetworkState: (state, action: PayloadAction<NetworkState>) => {
      state = action.payload;
      return state;
    },
    mutateNetworkState: (
      state,
      action: PayloadAction<Partial<NetworkState>>
    ) => {
      state = merge(state, action.payload);
      return state;
    },
  },
});

export const { setNetworkState, mutateNetworkState } = networkSlice.actions;

export default networkSlice.reducer;
