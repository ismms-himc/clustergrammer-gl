
module.exports = function zoom_rules_low_mat(params, zoom_restrict, zoom_data,
                                             viz_dim_heat, viz_dim_mat, axis){

  // convert offcenter WebGl units to pixel units
  var offcenter;
  if (axis === 'x'){
    offcenter = (params.viz_dim.canvas.width * params.offcenter[axis])/2;
  } else {
    offcenter = (params.viz_dim.canvas.height * params.offcenter[axis])/2;
  }

  // make a copy of zoom_data for later use (not a reference)
  var zoom_data_copy = _.clone(zoom_data);

  //////////////////////////////////////////////////////////////////////////////
  // Zooming Rules
  //////////////////////////////////////////////////////////////////////////////

  var max_zoom = zoom_restrict.max;
  var min_zoom = zoom_restrict.min;

  // first sanitize zooming out if already completely zoomed out
  if (zoom_data.total_zoom == 1 && zoom_data.inst_zoom < 1){
    zoom_data.inst_zoom = 1;
  }

  // calc unsanitized potential_total_zoom
  // checking this prevents the real total_zoom from going out of bounds
  var potential_total_zoom = zoom_data.total_zoom * zoom_data.inst_zoom;

  // var zooming_below_one = false;

  // zooming within allowed range
  if (potential_total_zoom < max_zoom && potential_total_zoom > min_zoom){
    zoom_data.total_zoom = potential_total_zoom;
  }

  // Zoom above max
  else if (potential_total_zoom >= max_zoom) {
    if (zoom_data.inst_zoom < 1){
      zoom_data.total_zoom = zoom_data.total_zoom * zoom_data.inst_zoom;
    } else {
      // bump zoom up to max
      zoom_data.inst_zoom = max_zoom/zoom_data.total_zoom;
      // set zoom to max
      zoom_data.total_zoom = max_zoom;
    }
  }
  // Zoom below min
  else if (potential_total_zoom <= min_zoom){
    if (zoom_data.inst_zoom > 1){
      zoom_data.total_zoom = zoom_data.total_zoom * zoom_data.inst_zoom;
    } else {

      // bump zoom down to min
      zoom_data.inst_zoom =  min_zoom/zoom_data.total_zoom;
      // set zoom to min
      zoom_data.total_zoom = min_zoom;
    }
  }

  // working on fixing zoom restrict when cursor is outside of matrix
  var inst_offset = viz_dim_mat.max - viz_dim_heat.max;

  //////////////////////////////////////////////////////////////////////////////
  // Pan by Drag Rules
  //////////////////////////////////////////////////////////////////////////////

  // do not allow simultaneous panning and zooming
  if (zoom_data.inst_zoom > 1){
    zoom_data.pan_by_drag = 0;
  }

  // restrict min pan_by_drag if necessary
  if (zoom_data.pan_by_drag > 0){
    if (zoom_data.total_pan_min + zoom_data.pan_by_drag >= 0){
      // push to edge
      zoom_data.pan_by_drag = -zoom_data.total_pan_min;
    }
  }

  // restrict max pan_by_drag if necessary
  if (zoom_data.pan_by_drag < 0){
    if (zoom_data.total_pan_max - zoom_data.pan_by_drag >= 0){
      // push to edge
      zoom_data.pan_by_drag = zoom_data.total_pan_max;
    }
  }


  // if (axis === 'x'){
  //   console.log(zoom_data.cursor_position, viz_dim_heat.min, offcenter, viz_dim_heat.min + offcenter)
  // }

  // restrict effective position of mouse
  if (zoom_data.cursor_position < viz_dim_heat.min + offcenter){
    zoom_data.cursor_position = viz_dim_heat.min + offcenter;
    // if (axis === 'x'){
    //   console.log(axis, 'less than min cursor position', viz_dim_heat.min + offcenter);
    // }
  } else if (zoom_data.cursor_position > viz_dim_heat.max + inst_offset  + offcenter){

    zoom_data.cursor_position = viz_dim_heat.max + inst_offset + offcenter;

  }

  // tracking cursor position relative to the minimum
  var cursor_relative_min = zoom_data.cursor_position - viz_dim_heat.min - offcenter;

  /* Cursor restriction does not seem to be doing anything */

  // restrict cursor_relative_min
  if (cursor_relative_min < 0){
    cursor_relative_min = 0;
    // console.log('LOWER than min ############################')
  } else if (cursor_relative_min > viz_dim_heat.max){
    cursor_relative_min = viz_dim_heat.max;
    // console.log('HIGHER than min ############################')
  }

  // tracking cursor position relative to the maximum
  /* trying to fix zoom in outside of matrix and zoom out inside of matrix bugn */
  var cursor_relative_max = viz_dim_heat.max + inst_offset - zoom_data.cursor_position +  offcenter;

  // restrict cursor_relative_max
  if (cursor_relative_max < 0){
    cursor_relative_max = 0;
    // console.log('LOWER than max ############################')
  } else if (cursor_relative_max > viz_dim_heat.max + inst_offset){
    cursor_relative_max = viz_dim_heat.max + inst_offset;
    // console.log('HIGHER than max ############################')
  }



  //////////////////////////////////////////////////////////////////////////////
  // Pan by Zoom Rules
  //////////////////////////////////////////////////////////////////////////////

  // pan_by_zoom relative to matrix max and min
  // zooming in causes negative panning
  // net positive panning is not allowed
  var inst_eff_zoom = zoom_data.inst_zoom - 1;
  zoom_data.pbz_relative_min = -inst_eff_zoom * cursor_relative_min;
  zoom_data.pbz_relative_max = -inst_eff_zoom * cursor_relative_max;

  // if (axis === 'x'){
  //   console.log(cursor_relative_min, cursor_relative_max, zoom_data.pbz_relative_min, zoom_data.pbz_relative_max);
  // }

  // calculate unsanitized versions of total pan values
  var potential_total_pan_min = zoom_data.total_pan_min +
                 zoom_data.pan_by_drag / zoom_data.total_zoom  +
                 zoom_data.pbz_relative_min / zoom_data.total_zoom ;


  // panning by drag has the opposite effect relative to the max/right side
  var potential_total_pan_max = zoom_data.total_pan_max +
                 -zoom_data.pan_by_drag / zoom_data.total_zoom  +
                 zoom_data.pbz_relative_max / zoom_data.total_zoom ;

  var zero_threshold = 0.0001;

  var fully_zoomed_out = false;
  if (zoom_data.total_pan_min >= 0 && zoom_data.total_pan_max >= 0){
    fully_zoomed_out = true;
  }

  var double_restrict = false;
  if (potential_total_pan_min > zero_threshold && potential_total_pan_max > zero_threshold ) {

    double_restrict = true;

    // has_been_both = true;
  }

  // Panning in bounds
  if (potential_total_pan_min <= zero_threshold && potential_total_pan_max <= zero_threshold){

    zoom_data.pan_by_zoom = -inst_eff_zoom * zoom_data.cursor_position;
    zoom_data.total_pan_min = potential_total_pan_min;
    zoom_data.total_pan_max = potential_total_pan_max;

    zoom_data.prev_restrict = false;

  }

  if (potential_total_pan_min > zero_threshold) {

    // push over by total_pan (negative value) times total zoom applied
    // need to push more when matrix has been effectively increased in size
    // steps: 1) pin to min matrix, and 2) push right (positive) by total remaining pan
    zoom_data.pan_by_zoom = -inst_eff_zoom * (viz_dim_heat.min + offcenter) - zoom_data.total_pan_min * zoom_data.total_zoom;

    // set total_pan_min to 0, no panning room remaining after being pushed right
    zoom_data.total_pan_min = 0;

    // the cursor is effectively locked on the min (left) side of the matrix
    var new_cursor_relative_max = viz_dim_heat.max - viz_dim_heat.min + offcenter;
    var new_pbz_relative_max = -inst_eff_zoom * new_cursor_relative_max;
    zoom_data.total_pan_max = zoom_data.total_pan_max + new_pbz_relative_max / zoom_data.total_zoom;

    // prevent push if fully zoomed out (&& inst_eff_zoom <=0)
    if (fully_zoomed_out == true){
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

  if (potential_total_pan_max > zero_threshold) {

    // console.log('PAN BY ZOOM GREATER THAN ZERO THRESHOLD')

    // zoom_data.pan_by_zoom = - inst_eff_zoom * zoom_data.cursor_position;
    // steps: 1) pin to max matrix, and 2) push left (negative) by total remaining pan
    // total_pan_max
    // zoom_data.pan_by_zoom = -inst_eff_zoom * viz_dim_heat.max + zoom_data.total_pan_max * zoom_data.total_zoom;
    // zoom_data.pan_by_zoom = -inst_eff_zoom * (viz_dim_heat.max + inst_offset) + zoom_data.total_pan_max * zoom_data.total_zoom;
    zoom_data.pan_by_zoom = -inst_eff_zoom * (viz_dim_heat.max + inst_offset + offcenter) + zoom_data.total_pan_max * zoom_data.total_zoom;

    // set total_pan_max to 0, no panning room remaining after being pushed left
    zoom_data.total_pan_max = 0 ;

    // the cursor is effectively locked on the max (right) side of the matrix
    // var new_cursor_relative_min = viz_dim_heat.max - viz_dim_heat.min;
    var new_cursor_relative_min = viz_dim_heat.max + inst_offset - viz_dim_heat.min + offcenter;
    var new_pbz_relative_min = -inst_eff_zoom * new_cursor_relative_min;
    zoom_data.total_pan_min = zoom_data.total_pan_min + new_pbz_relative_min / zoom_data.total_zoom;

    // prevent push if fully zoomed out
    if (fully_zoomed_out == true){
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

    console.log('\n\nAbout to pin matrix after double restriction \n----------------------------------------');
    // console.log('prev_restrict', zoom_data_copy.prev_restrict);

    // pin the matrix to either side
    // no need to push it to the edge since it was previously pushed to the edge
    if (zoom_data_copy.prev_restrict === 'min') {

      zoom_data.pan_by_zoom = -inst_eff_zoom * (viz_dim_heat.min + offcenter);

    } else if (zoom_data_copy.prev_restrict === 'max'){

      // zoom_data.pan_by_zoom = -inst_eff_zoom * viz_dim_heat.max;
      // zoom_data.pan_by_zoom = -inst_eff_zoom * (viz_dim_heat.max + inst_offset + offcenter);
      zoom_data.pan_by_zoom = -inst_eff_zoom * (viz_dim_heat.max + inst_offset + offcenter);

    }

  }

  return zoom_data;

};