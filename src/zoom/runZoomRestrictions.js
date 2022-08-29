import { cloneDeep } from "lodash";

export default (function run_zoom_restrictions(
  zoom_data,
  ptp,
  viz_dim_heat,
  original_prev_restrict
) {
  const newZoomData = cloneDeep(zoom_data);
  /*
    Sequential if statements
  */

  // ////////////////////////////////////////////////////////////////////////////
  // Prepare Restrictions
  // ////////////////////////////////////////////////////////////////////////////
  const zero_threshold = 0.0001;

  newZoomData.fully_zoomed_out = false;
  if (newZoomData.total_pan_min >= 0 && newZoomData.total_pan_max >= 0) {
    newZoomData.fully_zoomed_out = true;
  }

  let double_restrict = false;
  if (ptp.min > zero_threshold && ptp.max > zero_threshold) {
    double_restrict = true;
  }

  // ////////////////////////////////////////////////////////////////////////////
  // Panning in bounds
  // ////////////////////////////////////////////////////////////////////////////
  if (ptp.min <= zero_threshold && ptp.max <= zero_threshold) {
    newZoomData.pan_by_zoom =
      -newZoomData.inst_eff_zoom * newZoomData.cursor_position;
    newZoomData.total_pan_min = ptp.min;
    newZoomData.total_pan_max = ptp.max;
    newZoomData.prev_restrict = false;
  }

  // ////////////////////////////////////////////////////////////////////////////
  // Restrict total pan min
  // ////////////////////////////////////////////////////////////////////////////

  if (ptp.min > zero_threshold) {
    // pin to min matrix, and 2) push right (positive) by total remaining pan
    newZoomData.pan_by_zoom =
      -newZoomData.inst_eff_zoom *
        (viz_dim_heat.min + newZoomData.viz_offcenter) -
      newZoomData.total_pan_min * newZoomData.total_zoom;

    // set total_pan_min to 0, no panning room remaining after being pushed right
    newZoomData.total_pan_min = 0;

    // the cursor is effectively locked on the min (left) side of the matrix
    const new_cursor_relative_max =
      viz_dim_heat.max - viz_dim_heat.min + newZoomData.viz_offcenter;
    const new_pbz_relative_max =
      -newZoomData.inst_eff_zoom * new_cursor_relative_max;
    newZoomData.total_pan_max =
      newZoomData.total_pan_max + new_pbz_relative_max / newZoomData.total_zoom;

    // prevent push if fully zoomed out (&& newZoomData.inst_eff_zoom <=0)
    if (newZoomData.fully_zoomed_out === true) {
      newZoomData.pan_by_zoom = 0;
      newZoomData.total_pan_max = 0;
    }

    newZoomData.prev_restrict = "min";
  }

  // ////////////////////////////////////////////////////////////////////////////
  // Restrict total pan max
  // ////////////////////////////////////////////////////////////////////////////

  if (ptp.max > zero_threshold) {
    // pin to max matrix, and 2) push left (negative) by total remaining pan
    newZoomData.pan_by_zoom =
      -newZoomData.inst_eff_zoom *
        (viz_dim_heat.max +
          newZoomData.heat_offset +
          newZoomData.viz_offcenter) +
      newZoomData.total_pan_max * newZoomData.total_zoom;

    // set total_pan_max to 0, no panning room remaining after being pushed left
    newZoomData.total_pan_max = 0;

    // the cursor is effectively locked on the max (right) side of the matrix
    const new_cursor_relative_min =
      viz_dim_heat.max +
      newZoomData.heat_offset -
      viz_dim_heat.min +
      newZoomData.viz_offcenter;
    const new_pbz_relative_min =
      -newZoomData.inst_eff_zoom * new_cursor_relative_min;
    newZoomData.total_pan_min =
      newZoomData.total_pan_min + new_pbz_relative_min / newZoomData.total_zoom;

    // prevent push if fully zoomed out
    if (newZoomData.fully_zoomed_out === true) {
      newZoomData.pan_by_zoom = 0;
      newZoomData.total_pan_min = 0;
    }

    newZoomData.prev_restrict = "max";
  }

  // ////////////////////////////////////////////////////////////////////////////
  // Double Restriction
  // ////////////////////////////////////////////////////////////////////////////

  // if double restrict, pin to side that was previously pinned
  if (double_restrict) {
    // pin the matrix to either side
    // no need to push it to the edge since it was previously pushed to the edge
    if (original_prev_restrict === "min") {
      newZoomData.pan_by_zoom =
        -newZoomData.inst_eff_zoom *
        (viz_dim_heat.min + newZoomData.viz_offcenter);
    } else if (original_prev_restrict === "max") {
      newZoomData.pan_by_zoom =
        -newZoomData.inst_eff_zoom *
        (viz_dim_heat.max +
          newZoomData.heat_offset +
          newZoomData.viz_offcenter);
    }
  }

  return newZoomData;
});
