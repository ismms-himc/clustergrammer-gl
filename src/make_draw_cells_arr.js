var make_position_arr = require('./make_position_arr');
var make_opacity_arr = require('./make_opacity_arr');

module.exports = function make_draw_cells_arr(regl, params){

  // make arrays
  var arrs = {};
  arrs.opacity_arr = make_opacity_arr(params);
  arrs.position_arr = {};

  var inst_row_order = params['inst_order'].row;
  var inst_col_order = params['inst_order'].col;
  arrs.position_arr['ini'] = make_position_arr(params, inst_row_order, inst_col_order);

  var inst_row_order = params['new_order'].row;
  var inst_col_order = params['new_order'].col;
  arrs.position_arr['new'] = make_position_arr(params, inst_row_order, inst_col_order);

  return arrs;

};