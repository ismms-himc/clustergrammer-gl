import * as _ from "underscore";

export default (function calc_mat_arr(params) {
  const num_row = params.labels.num_row;
  const num_col = params.labels.num_col;
  // draw matrix cells
  // ///////////////////////////////////////
  // generate x position array
  params.node_canvas_pos = {};
  let inst_pos;
  let heat_size;
  let num_labels;
  let inst_index;
  let inst_direct;
  let tri_width;
  let heat_shift;
  _.each(["x", "y"], function (inst_axis) {
    if (inst_axis == "x") {
      num_labels = num_col;
    } else {
      num_labels = num_row;
    }
    heat_shift =
      params.viz_dim.mat_size[inst_axis] - params.viz_dim.heat_size[inst_axis];
    heat_size = params.viz_dim.heat_size[inst_axis];
    tri_width = heat_size / num_labels;
    params.node_canvas_pos[inst_axis + "_arr"] = Array(num_labels)
      .fill()
      .map(function (_, i) {
        if (inst_axis === "x") {
          inst_index = i;
          inst_direct = -1;
          num_labels = num_col;
        } else {
          inst_index = i + 1;
          inst_direct = 1;
          num_labels = num_row;
        }
        inst_pos = heat_size - heat_shift - 2 * tri_width * inst_index;
        return inst_pos * inst_direct;
      });
  });
});
