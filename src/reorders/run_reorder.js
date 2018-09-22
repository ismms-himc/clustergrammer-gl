var reorder_cat_args = require('./reorder_cat_args');
var reorder_matrix_args = require('./reorder_matrix_args');
var update_text_triangle_order = require('./../matrix_labels/update_text_triangle_order');

module.exports = function run_reorder(regl, cgm, inst_axis, ini_new_order){

  var params = cgm.params;

  var new_order = ini_new_order.replace('sum', 'rank')
                               .replace('var', 'rankvar');

  params.animation.run_switch = true;
  params.new_order[inst_axis] = new_order;

  reorder_matrix_args(regl, cgm);
  reorder_cat_args(regl, cgm);

  // preventing tmp reordering bug that happens when pre-calculated labels are
  // incorrectly animated on reordering. The bug seems to occur only when the
  // number of pre-calculated (drawn) rows is less than the total number of rows
  if (cgm.params.text_triangles.draw[inst_axis] != false && params['num_' + inst_axis] < params.max_num_text){
    params.text_triangles.draw[inst_axis] = update_text_triangle_order(params, inst_axis);
  } else {
    params.text_triangles.draw[inst_axis] = false;
  }

};