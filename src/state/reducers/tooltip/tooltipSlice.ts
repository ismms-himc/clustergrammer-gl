import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { merge } from "lodash";
import getInitialTooltipState from "./getInitialTooltipState";

export interface TooltipState {
  show_tooltip: boolean;
  disable_tooltip: boolean;
  in_bounds_tooltip: boolean;
  background_opacity: number;
  tooltip_type:
    | "out-of-bounds"
    | "matrix-cell"
    | "row-label"
    | "col-label"
    | "row-dendro"
    | "col-dendro"
    | string;
  border_width: number;
  on_canvas: boolean;
  permanent_tooltip: boolean;
  use_hzome: boolean;
  tooltip_id?: string;
  text: string;
  enabledTooltips: Array<"dendro" | "cat" | "cell" | "label" | string>;
}

const initialState: TooltipState = getInitialTooltipState();

export const tooltipSlice = createSlice({
  name: "tooltip",
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    setTooltipState: (state, action: PayloadAction<TooltipState>) => {
      state = action.payload;
      return state;
    },
    mutateTooltipState: (
      state,
      action: PayloadAction<Partial<TooltipState>>
    ) => {
      state = merge(state, action.payload);
      return state;
    },
  },
});

export const { setTooltipState, mutateTooltipState } = tooltipSlice.actions;

export default tooltipSlice.reducer;
