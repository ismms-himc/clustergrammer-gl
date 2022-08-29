import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { merge } from "lodash";
import { Ordering } from "../../../types/network";

type AxisOrdering = {
  [x: string]: Ordering;
  row: Ordering;
  col: Ordering;
};

export interface OrderState {
  inst: AxisOrdering;
  new: AxisOrdering;
}

const initialState: OrderState = {} as OrderState;

export const orderSlice = createSlice({
  name: "order",
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    setOrderState: (state, action: PayloadAction<OrderState>) => {
      state = action.payload;
      return state;
    },
    mutateOrderState: (state, action: PayloadAction<Partial<OrderState>>) => {
      state = merge(state, action.payload);
      return state;
    },
  },
});

export const { setOrderState, mutateOrderState } = orderSlice.actions;

export default orderSlice.reducer;
