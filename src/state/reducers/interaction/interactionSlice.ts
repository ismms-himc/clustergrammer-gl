import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { merge } from "lodash";
import getInitialInteractionState from "./getInitialInteractionState";

export interface InteractionState {
  total: number;
  still_interacting: boolean;
  still_mouseover: boolean;
  need_reset_cat_opacity: boolean;
  mouseover: {
    [x: string]: any;
    value: any;
    row: {
      name: string;
      cats: any[];
    };
    col: {
      name: string;
      cats: any[];
    };
  };
  enable_viz_interact: boolean;
  manual_update_cats: boolean;
}

const initialState: InteractionState =
  getInitialInteractionState() as unknown as InteractionState;

export const interactionSlice = createSlice({
  name: "interaction",
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    setInteractionState: (state, action: PayloadAction<InteractionState>) => {
      state = action.payload;
      return state;
    },
    mutateInteractionState: (
      state,
      action: PayloadAction<Partial<InteractionState>>
    ) => {
      state = merge(state, action.payload);
      return state;
    },
    setMouseoverInteraction: (
      state,
      action: PayloadAction<InteractionState["mouseover"]>
    ) => {
      state.mouseover = action.payload;
      return state;
    },
    incrementInteractionTotal: (state, action: PayloadAction<number>) => {
      state.total = state.total + action.payload;
      return state;
    },
  },
});

export const {
  setInteractionState,
  mutateInteractionState,
  setMouseoverInteraction,
  incrementInteractionTotal,
} = interactionSlice.actions;

export default interactionSlice.reducer;
