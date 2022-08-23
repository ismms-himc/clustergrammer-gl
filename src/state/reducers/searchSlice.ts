import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface SearchState {
  searched_rows: string[];
}

const initialState: SearchState = {
  searched_rows: [],
};

export const searchSlice = createSlice({
  name: "search",
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    setSearchedRows: (
      state,
      action: PayloadAction<SearchState["searched_rows"]>
    ) => {
      state.searched_rows = action.payload;
      return state;
    },
  },
});

export const { setSearchedRows } = searchSlice.actions;

export default searchSlice.reducer;
