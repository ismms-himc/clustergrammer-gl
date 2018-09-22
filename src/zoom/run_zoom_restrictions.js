module.exports = function run_zoom_restrictions(zoom_data, ptp, viz_dim_heat, offcenter, axis, inst_offset, zoom_data_copy){

  //////////////////////////////////////////////////////////////////////////////
  // Prepare Restrictions
  //////////////////////////////////////////////////////////////////////////////
  var zero_threshold = 0.0001;

  zoom_data.fully_zoomed_out = false;
  if (zoom_data.total_pan_min >= 0 && zoom_data.total_pan_max >= 0){
    zoom_data.fully_zoomed_out = true;
  }

  var double_restrict = false;
  if (ptp.min > zero_threshold && ptp.max > zero_threshold ) {
    double_restrict = true;
  }

  //////////////////////////////////////////////////////////////////////////////
  // Panning in bounds
  //////////////////////////////////////////////////////////////////////////////
  if (ptp.min <= zero_threshold && ptp.max <= zero_threshold){
    zoom_data.pan_by_zoom = -zoom_data.inst_eff_zoom * zoom_data.cursor_position;
    zoom_data.total_pan_min = ptp.min;
    zoom_data.total_pan_max = ptp.max;
    zoom_data.prev_restrict = false;
  }

  //////////////////////////////////////////////////////////////////////////////
  // Restrict total pan min
  //////////////////////////////////////////////////////////////////////////////

  if (ptp.min > zero_threshold) {

    // push over by total_pan (negative value) times total zoom applied
    // need to push more when matrix has been effectively increased in size
    // steps: 1) pin to min matrix, and 2) push right (positive) by total remaining pan
    zoom_data.pan_by_zoom = -zoom_data.inst_eff_zoom * (viz_dim_heat.min + offcenter) - zoom_data.total_pan_min * zoom_data.total_zoom;

    // set total_pan_min to 0, no panning room remaining after being pushed right
    zoom_data.total_pan_min = 0;

    // the cursor is effectively locked on the min (left) side of the matrix
    var new_cursor_relative_max = viz_dim_heat.max - viz_dim_heat.min + offcenter;
    var new_pbz_relative_max = -zoom_data.inst_eff_zoom * new_cursor_relative_max;
    zoom_data.total_pan_max = zoom_data.total_pan_max + new_pbz_relative_max / zoom_data.total_zoom;

    // prevent push if fully zoomed out (&& zoom_data.inst_eff_zoom <=0)
    if (zoom_data.fully_zoomed_out == true){
      if (axis === 'x'){
        // console.log('<<<<<<<<<< Min prevent push');
      }
      zoom_data.pan_by_zoom = 0;
      zoom_data.total_pan_max = 0;
    }

    // if (axis === 'x' && has_been_both === true){
    //   // debugger
    // }

    zoom_data.prev_restrict = 'min';

  }

  //////////////////////////////////////////////////////////////////////////////
  // Restrict total pan max
  //////////////////////////////////////////////////////////////////////////////

  if (ptp.max > zero_threshold) {

    // console.log('PAN BY ZOOM GREATER THAN ZERO THRESHOLD')

    // zoom_data.pan_by_zoom = - zoom_data.inst_eff_zoom * zoom_data.cursor_position;
    // steps: 1) pin to max matrix, and 2) push left (negative) by total remaining pan
    // total_pan_max
    // zoom_data.pan_by_zoom = -zoom_data.inst_eff_zoom * viz_dim_heat.max + zoom_data.total_pan_max * zoom_data.total_zoom;
    // zoom_data.pan_by_zoom = -zoom_data.inst_eff_zoom * (viz_dim_heat.max + inst_offset) + zoom_data.total_pan_max * zoom_data.total_zoom;
    zoom_data.pan_by_zoom = -zoom_data.inst_eff_zoom * (viz_dim_heat.max + inst_offset + offcenter) + zoom_data.total_pan_max * zoom_data.total_zoom;

    // set total_pan_max to 0, no panning room remaining after being pushed left
    zoom_data.total_pan_max = 0 ;

    // the cursor is effectively locked on the max (right) side of the matrix
    // var new_cursor_relative_min = viz_dim_heat.max - viz_dim_heat.min;
    var new_cursor_relative_min = viz_dim_heat.max + inst_offset - viz_dim_heat.min + offcenter;
    var new_pbz_relative_min = -zoom_data.inst_eff_zoom * new_cursor_relative_min;
    zoom_data.total_pan_min = zoom_data.total_pan_min + new_pbz_relative_min / zoom_data.total_zoom;

    // prevent push if fully zoomed out
    if (zoom_data.fully_zoomed_out == true){
      if (axis === 'x'){
        // console.log('>>>>>>>>>>>>> Max prevent push');
      }
      zoom_data.pan_by_zoom = 0;
      zoom_data.total_pan_min = 0;
    }

    zoom_data.prev_restrict = 'max';

  }

  //////////////////////////////////////////////////////////////////////////////
  // Double Restriction
  //////////////////////////////////////////////////////////////////////////////

  // if double restrict, pin to side that was previously pinned
  if (double_restrict){

    // console.log('\n\nAbout to pin matrix after double restriction \n----------------------------------------');
    // console.log('prev_restrict', zoom_data_copy.prev_restrict);

    // pin the matrix to either side
    // no need to push it to the edge since it was previously pushed to the edge
    if (zoom_data_copy.prev_restrict === 'min') {

      zoom_data.pan_by_zoom = -zoom_data.inst_eff_zoom * (viz_dim_heat.min + offcenter);

    } else if (zoom_data_copy.prev_restrict === 'max'){

      // zoom_data.pan_by_zoom = -zoom_data.inst_eff_zoom * viz_dim_heat.max;
      // zoom_data.pan_by_zoom = -zoom_data.inst_eff_zoom * (viz_dim_heat.max + inst_offset + offcenter);
      zoom_data.pan_by_zoom = -zoom_data.inst_eff_zoom * (viz_dim_heat.max + inst_offset + offcenter);

    }

  }

};