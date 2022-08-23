import * as _ from "underscore";
import gather_text_triangles from "../matrixLabels/gatherTextTriangles";

export default (function generate_text_triangle_params(state) {
  const { viz_area, labels, network } = state;
  // save text triangles for later use
  let text_triangles = {};
  const precalc = {};
  let label_queue_high;
  _.each(["row", "col"], function (inst_axis) {
    precalc[inst_axis] =
      labels["num_" + inst_axis] < state.visualization.max_num_text;
    // initial drawing of labels
    if (labels.precalc[inst_axis] === false) {
      text_triangles.draw = {};
      text_triangles.draw[inst_axis] = false;
    } else {
      const { draw, lqh, text_triangles_col_and_row } = gather_text_triangles(
        text_triangles,
        viz_area,
        labels,
        network,
        inst_axis
      );
      text_triangles = {
        ...text_triangles_col_and_row,
        draw,
      };
      label_queue_high = lqh;
    }
  });
  return { text_triangles, precalc, label_queue_high };
});
