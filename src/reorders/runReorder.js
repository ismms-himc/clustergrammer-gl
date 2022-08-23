import * as d3 from "d3";
import updateTextTriangleOrder from "../matrixLabels/updateTextTriangleOrder";
import reorderCatArgs from "./reorderCatArgs";
import reorderMatrixArgs from "./reorderMatrixArgs";

export default (function run_reorder(
  regl,
  state,
  catArgsManager,
  inst_axis,
  ini_new_order
) {
  const new_order = ini_new_order
    .replace("sum", "rank")
    .replace("var", "rankvar");
  if (new_order !== "clust") {
    d3.select("." + inst_axis + "_dendro_slider_svg").style("display", "none");
  }
  state.animation.run_animation = true;
  state.order.new[inst_axis] = new_order;
  reorderMatrixArgs(regl, state);
  reorderCatArgs(state, catArgsManager);
  // either update the existing draw text_triangles or trash them
  if (
    state.visualization.text_triangles.draw[inst_axis] !== false &&
    state.labels["num_" + inst_axis] <= state.max_num_text
  ) {
    state.visualization.text_triangles.draw[inst_axis] =
      updateTextTriangleOrder(state, inst_axis);
  } else {
    state.visualization.text_triangles.draw[inst_axis] = false;
  }
});
