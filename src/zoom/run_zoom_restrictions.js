module.exports = function run_zoom_restrictions(zd, ptp, viz_dim_heat, axis, zd_copy){

  /*
    Sequential if statements
  */

  //////////////////////////////////////////////////////////////////////////////
  // Prepare Restrictions
  //////////////////////////////////////////////////////////////////////////////
  var zero_threshold = 0.0001;

  zd.fully_zoomed_out = false;
  if (zd.total_pan_min >= 0 && zd.total_pan_max >= 0){
    zd.fully_zoomed_out = true;

  }

  var double_restrict = false;
  if (ptp.min > zero_threshold && ptp.max > zero_threshold ) {
    double_restrict = true;
  }

  //////////////////////////////////////////////////////////////////////////////
  // Panning in bounds
  //////////////////////////////////////////////////////////////////////////////
  if (ptp.min <= zero_threshold && ptp.max <= zero_threshold){
    zd.pan_by_zoom = -zd.inst_eff_zoom * zd.cursor_position;
    zd.total_pan_min = ptp.min;
    zd.total_pan_max = ptp.max;
    zd.prev_restrict = false;
  }

  //////////////////////////////////////////////////////////////////////////////
  // Restrict total pan min
  //////////////////////////////////////////////////////////////////////////////

  if (ptp.min > zero_threshold) {

    // pin to min matrix, and 2) push right (positive) by total remaining pan
    zd.pan_by_zoom = -zd.inst_eff_zoom * (viz_dim_heat.min + zd.viz_offcenter) - zd.total_pan_min * zd.total_zoom;

    // set total_pan_min to 0, no panning room remaining after being pushed right
    zd.total_pan_min = 0;

    // the cursor is effectively locked on the min (left) side of the matrix
    var new_cursor_relative_max = viz_dim_heat.max - viz_dim_heat.min + zd.viz_offcenter;
    var new_pbz_relative_max = -zd.inst_eff_zoom * new_cursor_relative_max;
    zd.total_pan_max = zd.total_pan_max + new_pbz_relative_max / zd.total_zoom;

    // prevent push if fully zoomed out (&& zd.inst_eff_zoom <=0)
    if (zd.fully_zoomed_out == true){
      zd.pan_by_zoom = 0;
      zd.total_pan_max = 0;
    }

    zd.prev_restrict = 'min';

  }

  //////////////////////////////////////////////////////////////////////////////
  // Restrict total pan max
  //////////////////////////////////////////////////////////////////////////////

  if (ptp.max > zero_threshold) {

    // pin to max matrix, and 2) push left (negative) by total remaining pan
    zd.pan_by_zoom = -zd.inst_eff_zoom * (viz_dim_heat.max + zd.heat_offset + zd.viz_offcenter) + zd.total_pan_max * zd.total_zoom;

    // set total_pan_max to 0, no panning room remaining after being pushed left
    zd.total_pan_max = 0 ;

    // the cursor is effectively locked on the max (right) side of the matrix
    var new_cursor_relative_min = viz_dim_heat.max + zd.heat_offset - viz_dim_heat.min + zd.viz_offcenter;
    var new_pbz_relative_min = -zd.inst_eff_zoom * new_cursor_relative_min;
    zd.total_pan_min = zd.total_pan_min + new_pbz_relative_min / zd.total_zoom;

    // prevent push if fully zoomed out
    if (zd.fully_zoomed_out == true){
      zd.pan_by_zoom = 0;
      zd.total_pan_min = 0;
    }

    zd.prev_restrict = 'max';

  }

  //////////////////////////////////////////////////////////////////////////////
  // Double Restriction
  //////////////////////////////////////////////////////////////////////////////

  // if double restrict, pin to side that was previously pinned
  if (double_restrict){

    // pin the matrix to either side
    // no need to push it to the edge since it was previously pushed to the edge
    if (zd_copy.prev_restrict === 'min') {

      zd.pan_by_zoom = -zd.inst_eff_zoom * (viz_dim_heat.min + zd.viz_offcenter);

    } else if (zd_copy.prev_restrict === 'max'){

      zd.pan_by_zoom = -zd.inst_eff_zoom * (viz_dim_heat.max + zd.heat_offset + zd.viz_offcenter);

    }

  }

};