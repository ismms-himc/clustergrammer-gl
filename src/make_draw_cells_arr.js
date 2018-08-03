var make_position_arr = require('./make_position_arr');
var make_opacity_arr = require('./make_opacity_arr');

module.exports = function make_draw_cells_arr(regl, params){

  // Make Arrays
  var opacity_arr = make_opacity_arr(params);
  var position_arr = make_position_arr(params);

  var arrs = {};
  arrs.opacity_arr = opacity_arr;
  arrs.position_arr = position_arr;

  return arrs;

};