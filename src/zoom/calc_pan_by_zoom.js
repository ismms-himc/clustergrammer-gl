module.exports = function calc_pan_by_zoom(zoom_data, cursor_relative){

  // pan_by_zoom relative to matrix max and min
  // zooming in causes negative panning
  // net positive panning is not allowed
  zoom_data.inst_eff_zoom = zoom_data.inst_zoom - 1;
  zoom_data.pbz_relative_min = -zoom_data.inst_eff_zoom * cursor_relative.min;
  zoom_data.pbz_relative_max = -zoom_data.inst_eff_zoom * cursor_relative.max;

};