var make_position_arr = require('./make_position_arr');
var make_opacity_arr = require('./make_opacity_arr');

module.exports = function make_draw_cells_arr(regl, params){

  // Make Arrays
  var opacity_arr = make_opacity_arr(params);
  var position_ini_arr = make_position_arr(params, 'inst_order');
  var position_new_arr = make_position_arr(params, 'new_order');

  var arrs = {};
  arrs.opacity_arr = opacity_arr;
  arrs.position_ini_arr = position_ini_arr;
  arrs.position_new_arr = position_new_arr;

  return arrs;

};