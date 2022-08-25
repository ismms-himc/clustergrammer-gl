import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { merge } from "lodash";

export type CatRoom = {
  webgl: number;
  x: number;
  y: number;
};

export type CatData = {
  length: number;
  cat_title: string;
  cats: any[];
};

export interface CategoriesState {
  showing_color_picker: boolean;
  manual_cat_dict: {
    col: Record<string, Record<string, string>>;
    row: Record<string, Record<string, string>>;
  };
  row: CatData[];
  col: CatData[];
  cat_num: {
    [x: string]: number;
    row: number;
    col: number;
  };
  cat_room: CatRoom;
}

const initialState: CategoriesState = {} as CategoriesState;

export const categoriesSlice = createSlice({
  name: "cat_data",
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    setCategoriesState: (state, action: PayloadAction<CategoriesState>) => {
      state = action.payload;
      return state;
    },
    mutateCategoriesState: (
      state,
      action: PayloadAction<Partial<CategoriesState>>
    ) => {
      state = merge(state, action.payload);
      return state;
    },
  },
});

export const { setCategoriesState, mutateCategoriesState } =
  categoriesSlice.actions;

export default categoriesSlice.reducer;
