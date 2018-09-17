var reorder_cat_args = require('./reorder_cat_args');
var reorder_matrix_args = require('./reorder_matrix_args');
var calc_text_triangles = require('./../matrix_labels/calc_text_triangles');

module.exports = function run_reorder(regl, cgm, inst_axis, ini_new_order){

  var params = cgm.params;

  console.log('clicking reorder: ' + ini_new_order);

  var new_order = ini_new_order.replace('sum', 'rank')
                               .replace('var', 'rankvar');

  params.animation.run_switch = true;
  params.new_order[inst_axis] = new_order;

  reorder_matrix_args(regl, cgm);
  reorder_cat_args(regl, cgm);

  console.log('re-calculating text_triangles')

  if (cgm.params.text_triangles.draw[inst_axis] != false){
    console.log('calc_text_triangles in reorder')
    var run_vect_text = true;
    params.text_triangles.draw[inst_axis] = calc_text_triangles(params, inst_axis, run_vect_text);
  }

  // wait until transition has finished to update order
  // cgm.params.inst_order[inst_axis] = new_order;

};