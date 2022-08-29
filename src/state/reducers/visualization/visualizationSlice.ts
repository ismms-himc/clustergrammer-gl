import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { merge } from "lodash";
import iniZoomData from "./helpers/iniZoomData";

export type TextZoom = {
  scaled_num: string;
  reference: number;
  factor: number;
  max_webgl_fs: number;
};

export type TextVector = {
  [x: string]: any;
  inst_offset: number[];
  new_offset: number[];
};

export interface ZoomRestriction extends MinMaxDimension {
  ratio: number;
}
export type ZoomRestrictions = {
  x: ZoomRestriction;
  y: ZoomRestriction;
};

export type ZoomAxisData = {
  inst_zoom: number;
  pan_by_zoom: number;
  pan_by_drag: number;
  cursor_position: number;
  cursor_rel_min: number;
  filter_zoom: number;
  pan_room: number;
  prev_restrict: boolean;
  show_text: boolean;
  still_zooming: boolean;
  total_pan_max: number;
  total_pan_min: number;
  total_zoom: number;
  zoom_step: number;
  viz_offcenter: number;
  heat_offset: number;
  inst_eff_zoom: number;
  fully_zoomed_out: boolean;
  pbz_relative_min: number;
  pbz_relative_max: number;
};

export type ZoomData = {
  x: ZoomAxisData;
  y: ZoomAxisData;
};

export type MinMaxDimension = {
  min: number;
  max: number;
};

export type Dimension = {
  x: number;
  y: number;
};

export type VisualizationDimensions = {
  canvas: {
    [x: string]: number;
    width: number;
    height: number;
  };
  center: Dimension;
  shift_camera: Dimension;
  heat_size: Dimension;
  mat_size: Dimension;
  heat: {
    width: number;
    height: number;
    x: MinMaxDimension;
    y: MinMaxDimension;
  };
  mat: {
    height: number;
    width: number;
    x: MinMaxDimension;
    y: MinMaxDimension;
  };
  offcenter: Dimension;
  tile_height: number;
  tile_width: number;
};

export type TextTriangles = {
  row: Record<string, Record<string, TextVector>>;
  col: Record<string, Record<string, TextVector>>;
  draw: Record<string, any>;
};

export interface VisualizationState {
  allow_zoom?: {
    row: number;
    col: number;
  };
  is_downsampled: boolean;
  tile_pix_width: number;
  tile_pix_height: number;
  zoom_restrict: ZoomRestrictions;
  max_zoom: number;
  text_zoom?: {
    row?: TextZoom;
    col?: TextZoom;
  };
  text_triangles?: TextTriangles;
  max_num_text: number;
  zoom_data: ZoomData;
  viz_dim: VisualizationDimensions;
  reset_cameras: boolean;
  rootElementId: string;
  total_mouseover: number;
}

const initialState: VisualizationState = (() => {
  const zoom_data = iniZoomData();
  return {
    is_downsampled: false,
    tile_pix_width: 0,
    tile_pix_height: 0,
    max_zoom: 0,
    max_num_text: 200,
    zoom_data: zoom_data as ZoomData,
    viz_dim: {} as VisualizationDimensions,
    reset_cameras: false,
    rootElementId: "",
    total_mouseover: 0,
    zoom_restrict: {
      x: { ratio: 1.0, min: 0, max: 0 },
      y: { ratio: 1.0, min: 0, max: 0 },
    },
  };
})();

export const visualizationSlice = createSlice({
  name: "visualization",
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    setVisualizationState: (
      state,
      action: PayloadAction<VisualizationState>
    ) => {
      state = action.payload;
      return state;
    },
    mutateVisualizationState: (
      state,
      action: PayloadAction<Partial<VisualizationState>>
    ) => {
      state = merge(state, action.payload);
      return state;
    },
    mutateZoomData: (
      state,
      action: PayloadAction<Partial<VisualizationState["zoom_data"]>>
    ) => {
      state.zoom_data = merge(state.zoom_data, action.payload);
      return state;
    },
    setZoomData: (
      state,
      action: PayloadAction<VisualizationState["zoom_data"]>
    ) => {
      state.zoom_data = action.payload;
      return state;
    },
    setVisualizationDimensions: (
      state,
      action: PayloadAction<VisualizationState["viz_dim"]>
    ) => {
      state.viz_dim = action.payload;
      return state;
    },
    setTotalMouseover: (state, action: PayloadAction<number>) => {
      state.total_mouseover = action.payload;
      return state;
    },
  },
});

export const {
  setVisualizationState,
  mutateVisualizationState,
  mutateZoomData,
  setZoomData,
  setVisualizationDimensions,
  setTotalMouseover,
} = visualizationSlice.actions;

export default visualizationSlice.reducer;
