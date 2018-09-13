var reorder_cat_args = require('./reorder_cat_args');
var reorder_matrix_args = require('./reorder_matrix_args');

module.exports = function run_reorder(regl, cgm, inst_axis, ini_new_order){

  console.log('clicking reorder: ' + ini_new_order);

  var new_order = ini_new_order.replace('sum', 'rank')
                               .replace('var', 'rankvar');

  cgm.params.animation.run_switch = true;
  cgm.params.new_order[inst_axis] = new_order;

  reorder_matrix_args(regl, cgm);
  reorder_cat_args(regl, cgm);

  cgm.params.inst_order[inst_axis] = new_order;

};