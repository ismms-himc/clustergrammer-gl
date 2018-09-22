module.exports = function calc_pan_by_zoom(zd, cursor_relative){

  // pan_by_zoom relative to matrix max and min
  // zooming in causes negative panning
  // net positive panning is not allowed
  zd.inst_eff_zoom = zd.inst_zoom - 1;
  zd.pbz_relative_min = -zd.inst_eff_zoom * cursor_relative.min;
  zd.pbz_relative_max = -zd.inst_eff_zoom * cursor_relative.max;

  // if (axis === 'x'){
  //   console.log(cursor_relative.min, cursor_relative.max, zd.pbz_relative_min, zd.pbz_relative_max);
  // }

};