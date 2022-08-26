import * as _ from "underscore";

export default (function calcMatArr(store) {
  const { labels, visualization } = store.getState();
  const num_row = labels.num_row;
  const num_col = labels.num_col;
  // draw matrix cells
  // ///////////////////////////////////////
  // generate x position array
  const node_canvas_pos = {};
  let inst_pos;
  let heat_size;
  let num_labels;
  let inst_index;
  let inst_direct;
  let tri_width;
  let heat_shift;
  _.each(["x", "y"], function (inst_axis) {
    if (inst_axis === "x") {
      num_labels = num_col;
    } else {
      num_labels = num_row;
    }
    heat_shift =
      visualization.viz_dim.mat_size[inst_axis] -
      visualization.viz_dim.heat_size[inst_axis];
    heat_size = visualization.viz_dim.heat_size[inst_axis];
    tri_width = heat_size / num_labels;
    node_canvas_pos[inst_axis + "_arr"] = Array(num_labels)
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

  return node_canvas_pos;
});
