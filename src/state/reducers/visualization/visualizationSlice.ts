import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { merge, set } from "lodash";
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

export type ZoomRestriction = {
  max: number;
  min: number;
  ratio: number;
};
export type ZoomRestrictions = {
  x: ZoomRestriction;
  y: ZoomRestriction;
};

export type ZoomAxisData = {
  inst_zoom: number;
  pan_by_zoom: number;
  pan_by_drag: number;
  total_mouseover: number;
  cursor_position: number;
  cursor_rel_min: number;
  filter_zoom: number;
  pan_room: number;
  prev_restrict: false;
  show_text: false;
  still_zooming: false;
  total_pan_max: number;
  total_pan_min: number;
  total_zoom: number;
  zoom_step: number;
};

export type ZoomData = {
  x?: ZoomAxisData;
  y?: ZoomAxisData;
};

export type VizDimHeat = {
  min: number;
  max: number;
};

export type VisualizationDimensions = {
  shift_camera: {
    x: number;
    y: number;
  };
  heat_size: {
    x: number;
    y: number;
  };
  mat_size: {
    x: number;
    y: number;
  };
  heat: {
    width: number;
    height: number;
    x: VizDimHeat;
    y: VizDimHeat;
  };
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
  zoom_restrict?: ZoomRestrictions;
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
    setVisualizationDimensions: (
      state,
      action: PayloadAction<VisualizationState["viz_dim"]>
    ) => {
      state.viz_dim = action.payload;
      return state;
    },
    setTotalMouseover: (
      state,
      action: PayloadAction<{ axis: "x" | "y"; num: number }>
    ) => {
      const { axis, num } = action.payload;
      set(state, ["zoom_data", axis, "total_mouseover"], num);
      return state;
    },
  },
});

export const {
  setVisualizationState,
  mutateVisualizationState,
  mutateZoomData,
  setVisualizationDimensions,
  setTotalMouseover,
} = visualizationSlice.actions;

export default visualizationSlice.reducer;
