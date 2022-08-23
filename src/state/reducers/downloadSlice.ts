import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface DownloadState {
  delimiter_name: string;
  delimiter_key: {
    csv: string;
    tsv: string;
    tuple: string;
  };
  meta_type: string;
}

const initialState: DownloadState = {
  delimiter_name: "csv",
  delimiter_key: {
    // TODO: this should just be a constant/enum
    csv: ",",
    tsv: "\t",
    tuple: "\t",
  },
  meta_type: "col",
};

export const downloadSlice = createSlice({
  name: "download",
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    setDelimiterForFileType: (
      state,
      action: PayloadAction<DownloadState["delimiter_name"]>
    ) => {
      state.delimiter_name = action.payload;
      return state;
    },
  },
});

export const { setDelimiterForFileType } = downloadSlice.actions;

export default downloadSlice.reducer;
