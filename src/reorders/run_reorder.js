var make_position_arr = require('./../matrix_cells/make_position_arr');
var reorder_cat_args = require('./reorder_cat_args');

module.exports = function run_reorder(regl, cgm, inst_axis, ini_new_order){

  console.log('clicking reorder: ' + ini_new_order)

  var new_order = ini_new_order.replace('sum', 'rank')
                               .replace('var', 'rankvar');

  var params = cgm.params;

  params.animation.run_switch = true;
  params.new_order[inst_axis] = new_order;

  // calculate new ordering
  params.arrs.position_arr.new = make_position_arr(params,
                                  params.new_order.row,
                                  params.new_order.col);

  params.matrix_args.regl_props.rects.attributes.pos_att_new = {
        buffer: regl.buffer(params.arrs.position_arr.new),
        divisor: 1
      };

  reorder_cat_args(regl, cgm);

  // update inst_order
  cgm.params.inst_order[inst_axis] = new_order;

};