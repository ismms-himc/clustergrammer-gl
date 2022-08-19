import * as _ from "underscore";
import calc_cursor_relative from "./calcCursorRelative";
import calc_pan_by_zoom from "./calcPanByZoom";
import calc_potential_total_pan from "./calcPotentialTotalPan";
import pan_by_drag_rules from "./panByDragRules";
import run_zoom_restrictions from "./runZoomRestrictions";
import sanitize_inst_zoom from "./sanitizeInstZoom";
import sanitize_potential_zoom from "./sanitizePotentialZoom";

export default (function zoom_rules_low_mat(
  params,
  zoom_restrict,
  zoom_data,
  viz_dim_heat,
  viz_dim_mat,
  axis
) {
  // convert offcenter WebGl units to pixel units
  let canvas_dim;
  if (axis === "x") {
    canvas_dim = "width";
  } else {
    canvas_dim = "height";
  }
  zoom_data.viz_offcenter =
    (params.viz_dim.canvas[canvas_dim] * params.viz_dim.offcenter[axis]) / 2;
  // make a copy of zoom_data for later use (not a reference)
  const zoom_data_copy = _.clone(zoom_data);
  // ////////////////////////////////////////////////////////////////////////////
  // Sanitize Zoom
  // ////////////////////////////////////////////////////////////////////////////
  sanitize_inst_zoom(params, zoom_data);
  sanitize_potential_zoom(zoom_data, zoom_restrict);
  zoom_data.heat_offset = viz_dim_mat.max - viz_dim_heat.max;
  // ////////////////////////////////////////////////////////////////////////////
  // Pan by Drag Rules
  // ////////////////////////////////////////////////////////////////////////////
  pan_by_drag_rules(zoom_data, viz_dim_heat);
  const cursor_relative = calc_cursor_relative(zoom_data, viz_dim_heat);
  // ////////////////////////////////////////////////////////////////////////////
  // Pan by Zoom Rules
  // ////////////////////////////////////////////////////////////////////////////
  calc_pan_by_zoom(zoom_data, cursor_relative);
  // ////////////////////////////////////////////////////////////////////////////
  // Potential Total Pan
  // ////////////////////////////////////////////////////////////////////////////
  const ptp = calc_potential_total_pan(zoom_data);
  run_zoom_restrictions(zoom_data, ptp, viz_dim_heat, zoom_data_copy);
  return zoom_data;
});
