import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { merge } from "lodash";
import genIntPar from "../animation/getInitialAnimationState";

export interface AnimationState {
  time_remain: number;
  running: boolean;
  run_animation: boolean;
  last_switch_time: number;
  ani_duration: number;
  duration_end: number;
  time: number;
  first_frame: boolean;
  ini_viz: boolean;
  last_click: number;
  dblclick_duration: number;
  update_viz: boolean;
}

const initialState: AnimationState = genIntPar();

export const animationSlice = createSlice({
  name: "animation",
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    setAnimationState: (state, action: PayloadAction<AnimationState>) => {
      state = action.payload;
      return state;
    },
    mutateAnimationState: (
      state,
      action: PayloadAction<Partial<AnimationState>>
    ) => {
      state = merge(state, action.payload);
      return state;
    },
  },
});

export const { setAnimationState, mutateAnimationState } =
  animationSlice.actions;

export default animationSlice.reducer;
