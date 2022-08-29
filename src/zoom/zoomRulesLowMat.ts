import { Store } from "@reduxjs/toolkit";
import { cloneDeep } from "lodash";
import { mutateZoomData } from "../state/reducers/visualization/visualizationSlice";
import { RootState } from "../state/store/store";
import calc_cursor_relative from "./calcCursorRelative";
import calc_pan_by_zoom from "./calcPanByZoom";
import calc_potential_total_pan from "./calcPotentialTotalPan";
import pan_by_drag_rules from "./panByDragRules";
import run_zoom_restrictions from "./runZoomRestrictions";
import sanitize_inst_zoom from "./sanitizeInstZoom";
import sanitize_potential_zoom from "./sanitizePotentialZoom";

export default (function zoom_rules_low_mat(
  store: Store<RootState>,
  axis: "x" | "y"
) {
  const {
    visualization: { viz_dim, zoom_data: zd },
  } = store.getState();
  const zoom_data = zd[axis];
  const viz_dim_heat = viz_dim.heat[axis];
  const viz_dim_mat = viz_dim.mat[axis];

  // store original restriction
  const prevRestrict = zoom_data?.prev_restrict;
  // copy zoom data so we can operate on it without fear of mutating the original (not possible I think but)
  const newZoomData = cloneDeep(zoom_data);
  // convert offcenter WebGl units to pixel units
  let canvas_dim;
  if (axis === "x") {
    canvas_dim = "width";
  } else {
    canvas_dim = "height";
  }
  if (newZoomData) {
    newZoomData.viz_offcenter =
      (viz_dim.canvas[canvas_dim] * viz_dim.offcenter[axis]) / 2;
  }
  // ////////////////////////////////////////////////////////////////////////////
  // Sanitize Zoom
  // ////////////////////////////////////////////////////////////////////////////
  // first sanitize zooming out if already completely zoomed out
  const sanitizedZoomData = sanitize_inst_zoom(store, newZoomData);
  const sanitizedPotentialZoomData = sanitize_potential_zoom(
    store,
    sanitizedZoomData,
    axis
  );
  const heatOffsetZoomData = cloneDeep(sanitizedPotentialZoomData);
  heatOffsetZoomData.heat_offset = viz_dim_mat.max - viz_dim_heat.max;
  // ////////////////////////////////////////////////////////////////////////////
  // Pan by Drag Rules
  // ////////////////////////////////////////////////////////////////////////////
  const zoomDataWithPanByDragRules = pan_by_drag_rules(
    heatOffsetZoomData,
    viz_dim_heat
  );
  // calculate relative cursor
  const cursor_relative = calc_cursor_relative(
    zoomDataWithPanByDragRules,
    viz_dim_heat
  );
  // ////////////////////////////////////////////////////////////////////////////
  // Pan by Zoom Rules
  // ////////////////////////////////////////////////////////////////////////////
  const zoomDataWithPanByZoomRules = calc_pan_by_zoom(
    zoomDataWithPanByDragRules,
    cursor_relative
  );
  // ////////////////////////////////////////////////////////////////////////////
  // Potential Total Pan
  // ////////////////////////////////////////////////////////////////////////////
  const ptp = calc_potential_total_pan(zoomDataWithPanByZoomRules);
  const finalZoomData = run_zoom_restrictions(
    zoomDataWithPanByZoomRules,
    ptp,
    viz_dim_heat,
    prevRestrict
  );

  store.dispatch(
    mutateZoomData({
      [axis]: finalZoomData,
    })
  );
});
