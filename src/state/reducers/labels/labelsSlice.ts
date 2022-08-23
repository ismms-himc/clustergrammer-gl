import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { merge } from "lodash";

export interface LabelsState {
  num_row: number;
  num_col: number;
  offset_dict: {
    row: Record<string, any>;
    col: Record<string, any>;
  };
  draw_labels: boolean;
  font_detail: number;
  titles: {
    row?: string;
    col?: string;
  };
  precalc: {
    row?: boolean;
    col?: boolean;
  };
  ordered_labels: {
    [x: string]: any;
    rows?: string[];
    cols?: string[];
    row_indices?: number[];
    col_indices?: number[];
  };
  labels_queue?: {
    high?: Record<string, string[]>;
    low?: Record<string, string[]>;
  };
  max_label_queue: number;
  visible_labels?: Record<string, string[]>;
}

const initialState: LabelsState = {
  num_row: 0,
  num_col: 0,
  offset_dict: {} as LabelsState["offset_dict"],
  draw_labels: false,
  // font_detail range: min ~12 max ~200
  // usable range: 14-30 (was using 25)
  font_detail: 40,
  titles: {},
  precalc: {},
  ordered_labels: {},
  labels_queue: {},
  max_label_queue: 2000,
};

export const labelsSlice = createSlice({
  name: "labels",
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    setLabelsState: (state, action: PayloadAction<LabelsState>) => {
      state = action.payload;
      return state;
    },
    mutateLabelsState: (state, action: PayloadAction<Partial<LabelsState>>) => {
      state = merge(state, action.payload);
      return state;
    },
    setLabelsOffsetDict: (
      state,
      action: PayloadAction<LabelsState["offset_dict"]>
    ) => {
      state.offset_dict = action.payload;
      return state;
    },
    setLabelsQueue: (
      state,
      action: PayloadAction<LabelsState["labels_queue"]>
    ) => {
      state.labels_queue = action.payload;
      return state;
    },
  },
});

export const {
  setLabelsState,
  mutateLabelsState,
  setLabelsOffsetDict,
  setLabelsQueue,
} = labelsSlice.actions;

export default labelsSlice.reducer;
