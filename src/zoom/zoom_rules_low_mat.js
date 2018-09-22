var sanitize_inst_zoom = require('./sanitize_inst_zoom');
var sanitize_potential_zoom = require('./sanitize_potential_zoom');
var pan_by_drag_rules = require('./pan_by_drag_rules');
var calc_cursor_relative = require('./calc_cursor_relative');
var calc_pan_by_zoom = require('./calc_pan_by_zoom');
var calc_potential_total_pan = require('./calc_potential_total_pan');
var run_zoom_restrictions = require('./run_zoom_restrictions');

module.exports = function zoom_rules_low_mat(params, zoom_restrict, zoom_data,
                                             viz_dim_heat, viz_dim_mat, axis){

  // convert offcenter WebGl units to pixel units
  var canvas_dim;
  if (axis === 'x'){
    canvas_dim = 'width';
  } else {
    canvas_dim = 'height';
  }
  zoom_data.viz_offcenter = (params.viz_dim.canvas[canvas_dim] * params.offcenter[axis])/2;

  // make a copy of zoom_data for later use (not a reference)
  var zoom_data_copy = _.clone(zoom_data);

  //////////////////////////////////////////////////////////////////////////////
  // Sanitize Zoom
  //////////////////////////////////////////////////////////////////////////////
  sanitize_inst_zoom(zoom_data);
  sanitize_potential_zoom(zoom_data, zoom_restrict);
  zoom_data.heat_offset = viz_dim_mat.max - viz_dim_heat.max;

  //////////////////////////////////////////////////////////////////////////////
  // Pan by Drag Rules
  //////////////////////////////////////////////////////////////////////////////
  pan_by_drag_rules(zoom_data, viz_dim_heat);
  var cursor_relative = calc_cursor_relative(zoom_data, viz_dim_heat);

  //////////////////////////////////////////////////////////////////////////////
  // Pan by Zoom Rules
  //////////////////////////////////////////////////////////////////////////////
  calc_pan_by_zoom(zoom_data, cursor_relative);

  //////////////////////////////////////////////////////////////////////////////
  // Potential Total Pan
  //////////////////////////////////////////////////////////////////////////////
  var ptp = calc_potential_total_pan(zoom_data);
  run_zoom_restrictions(zoom_data, ptp, viz_dim_heat, axis, zoom_data_copy);

  return zoom_data;

};