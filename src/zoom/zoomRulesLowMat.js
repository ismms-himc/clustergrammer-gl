import * as _ from "underscore";
import calc_cursor_relative from "./calcCursorRelative";
import calc_pan_by_zoom from "./calcPanByZoom";
import calc_potential_total_pan from "./calcPotentialTotalPan";
import pan_by_drag_rules from "./panByDragRules";
import run_zoom_restrictions from "./runZoomRestrictions";
import sanitize_inst_zoom from "./sanitizeInstZoom";
import sanitize_potential_zoom from "./sanitizePotentialZoom";

export default (function zoom_rules_low_mat(
  viz_dim,
  zoom_restrict,
  zoom_data,
  viz_dim_heat,
  viz_dim_mat,
  axis
) {
  // store original restriction
  const prevRestrict = zoom_data.prev_restrict;
  // copy zoom data so we can operate on it without fear of mutating the original (not possible I think but)
  const zoomDataCopy = _.clone(zoom_data);
  // convert offcenter WebGl units to pixel units
  let canvas_dim;
  if (axis === "x") {
    canvas_dim = "width";
  } else {
    canvas_dim = "height";
  }
  zoomDataCopy.viz_offcenter =
    (viz_dim.canvas[canvas_dim] * viz_dim.offcenter[axis]) / 2;
  // ////////////////////////////////////////////////////////////////////////////
  // Sanitize Zoom
  // ////////////////////////////////////////////////////////////////////////////
  // first sanitize zooming out if already completely zoomed out
  const { zd: sanitizedZoomData, reset_cameras } =
    sanitize_inst_zoom(zoomDataCopy);
  const saitizedPotentialZoomData = sanitize_potential_zoom(
    sanitizedZoomData,
    zoom_restrict
  );
  saitizedPotentialZoomData.heat_offset = viz_dim_mat.max - viz_dim_heat.max;
  // ////////////////////////////////////////////////////////////////////////////
  // Pan by Drag Rules
  // ////////////////////////////////////////////////////////////////////////////
  const zoomDataWithPanByDragRules = pan_by_drag_rules(
    saitizedPotentialZoomData,
    viz_dim_heat
  );
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
  const zoomDataWithRestrictions = run_zoom_restrictions(
    zoomDataWithPanByZoomRules,
    ptp,
    viz_dim_heat,
    prevRestrict
  );
  return { zoom_data: zoomDataWithRestrictions, reset_cameras };
});
