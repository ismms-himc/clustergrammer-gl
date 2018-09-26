var make_position_arr = require('./../matrix_cells/make_position_arr');

module.exports = function reorder_matrix_args(regl, cgm){
  var params = cgm.params;

  // calculate new ordering
  params.arrs.position_arr.new = make_position_arr(params,
                                  params.order.new.row,
                                  params.order.new.col);

  params.matrix_args.regl_props.rects.attributes.pos_att_new = {
        buffer: regl.buffer(params.arrs.position_arr.new),
        divisor: 1
      };
};