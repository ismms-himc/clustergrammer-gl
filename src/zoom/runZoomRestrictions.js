export default (function run_zoom_restrictions(
  zoom_data,
  ptp,
  viz_dim_heat,
  original_prev_restrict
) {
  /*
      Sequential if statements
    */
  // ////////////////////////////////////////////////////////////////////////////
  // Prepare Restrictions
  // ////////////////////////////////////////////////////////////////////////////
  const zero_threshold = 0.0001;

  let double_restrict = false;
  if (ptp.min > zero_threshold && ptp.max > zero_threshold) {
    double_restrict = true;
  }

  // ////////////////////////////////////////////////////////////////////////////
  // Panning in bounds
  // ////////////////////////////////////////////////////////////////////////////
  let pan_by_zoom = -zoom_data.inst_eff_zoom * zoom_data.cursor_position;
  let total_pan_min = ptp.min;
  let total_pan_max = ptp.max;
  let prev_restrict = false;
  // ////////////////////////////////////////////////////////////////////////////
  // Restrict total pan min
  // ////////////////////////////////////////////////////////////////////////////
  if (ptp.min > zero_threshold) {
    // pin to min matrix, and 2) push right (positive) by total remaining pan
    pan_by_zoom =
      -zoom_data.inst_eff_zoom * (viz_dim_heat.min + zoom_data.viz_offcenter) -
      zoom_data.total_pan_min * zoom_data.total_zoom;
    // set total_pan_min to 0, no panning room remaining after being pushed right
    total_pan_min = 0;
    // the cursor is effectively locked on the min (left) side of the matrix
    const new_cursor_relative_max =
      viz_dim_heat.max - viz_dim_heat.min + zoom_data.viz_offcenter;
    const new_pbz_relative_max =
      -zoom_data.inst_eff_zoom * new_cursor_relative_max;
    total_pan_max =
      zoom_data.total_pan_max + new_pbz_relative_max / zoom_data.total_zoom;
    // prevent push if fully zoomed out (&& zd.inst_eff_zoom <=0)
    if (zoom_data.fully_zoomed_out === true) {
      pan_by_zoom = 0;
      total_pan_max = 0;
    }
    prev_restrict = "min";
  }
  // ////////////////////////////////////////////////////////////////////////////
  // Restrict total pan max
  // ////////////////////////////////////////////////////////////////////////////
  if (ptp.max > zero_threshold) {
    // pin to max matrix, and 2) push left (negative) by total remaining pan
    pan_by_zoom =
      -zoom_data.inst_eff_zoom *
        (viz_dim_heat.max + zoom_data.heat_offset + zoom_data.viz_offcenter) +
      zoom_data.total_pan_max * zoom_data.total_zoom;
    // set total_pan_max to 0, no panning room remaining after being pushed left
    total_pan_max = 0;
    // the cursor is effectively locked on the max (right) side of the matrix
    const new_cursor_relative_min =
      viz_dim_heat.max +
      zoom_data.heat_offset -
      viz_dim_heat.min +
      zoom_data.viz_offcenter;
    const new_pbz_relative_min =
      -zoom_data.inst_eff_zoom * new_cursor_relative_min;
    total_pan_min =
      zoom_data.total_pan_min + new_pbz_relative_min / zoom_data.total_zoom;
    // prevent push if fully zoomed out
    if (zoom_data.fully_zoomed_out === true) {
      pan_by_zoom = 0;
      total_pan_min = 0;
    }
    prev_restrict = "max";
  }
  // ////////////////////////////////////////////////////////////////////////////
  // Double Restriction
  // ////////////////////////////////////////////////////////////////////////////
  // if double restrict, pin to side that was previously pinned
  if (double_restrict) {
    // pin the matrix to either side
    // no need to push it to the edge since it was previously pushed to the edge
    if (original_prev_restrict === "min") {
      pan_by_zoom =
        -zoom_data.inst_eff_zoom * (viz_dim_heat.min + zoom_data.viz_offcenter);
    } else if (original_prev_restrict === "max") {
      pan_by_zoom =
        -zoom_data.inst_eff_zoom *
        (viz_dim_heat.max + zoom_data.heat_offset + zoom_data.viz_offcenter);
    }
  }

  return {
    ...zoom_data,
    pan_by_zoom,
    total_pan_max,
    total_pan_min,
    prev_restrict,
  };
});
