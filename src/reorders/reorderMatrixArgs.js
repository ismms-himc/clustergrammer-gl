import make_position_arr from "../matrixCells/makePositionArr";

export default (function reorder_matrix_args(regl, params) {
  // calculate new ordering
  params.arrs.position_arr.new = make_position_arr(
    params,
    params.order.new.row,
    params.order.new.col
  );
  params.regl_props.attributes.pos_att_new = {
    buffer: regl.buffer(params.arrs.position_arr.new),
    divisor: 1,
  };
});
