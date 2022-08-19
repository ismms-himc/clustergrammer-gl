import * as _ from "underscore";
import make_cat_position_array from "../cats/makeCatPositionArray";

export default (function reorder_cat_args(regl, params) {
  // can make more efficient by only checking which axis needs to be reordered
  _.each(["row", "col"], function (inst_axis) {
    // update cat position arrays
    for (
      let cat_index = 0;
      cat_index < params.cat_data.cat_num[inst_axis];
      cat_index++
    ) {
      params.cat_arrs.new[inst_axis][cat_index] = make_cat_position_array(
        params,
        inst_axis,
        cat_index,
        params.order.new[inst_axis]
      );
      // update the attribute
      params.cat_args[inst_axis][cat_index].attributes.cat_pos_att_new = {
        buffer: regl.buffer(params.cat_arrs.new[inst_axis][cat_index]),
        divisor: 1,
      };
    }
  });
});
