import * as _ from "underscore";
import { zoom_function } from "../cameras/zoomFunction";
import makeDendroArgs from "../dendrogram/makeDendroArgs";
import gatherTextTriangles from "../matrixLabels/gatherTextTriangles";
import makeColTextArgs from "../matrixLabels/makeColTextArgs";
import makeRowTextArgs from "../matrixLabels/makeRowTextArgs";
import makeVizAidTriArgs from "../matrixLabels/makeVizAidTriArgs";
import calcVizArea from "../params/calcVizArea";
import interpFun from "./interpFun";

export default (function drawAxisComponents(
  regl,
  state,
  catArgsManager,
  inst_axis,
  calc_text_tri = false
) {
  const dendroArgs = makeDendroArgs(regl, state, inst_axis);
  let axis_dim;
  if (inst_axis === "col") {
    axis_dim = "x";
  } else {
    axis_dim = "y";
  }
  /* Axis Components */
  state.cameras[inst_axis + "-labels"].draw(() => {
    // viz aid triangles
    state.viz_aid_tri_args[inst_axis] = makeVizAidTriArgs(
      regl,
      state,
      inst_axis
    );
    regl(state.viz_aid_tri_args[inst_axis])();
    // drawing the label categories and dendrogram using the same camera as the
    // matrix (no special zooming required)
    const cat_args = catArgsManager.getCatArgs();
    _.each(cat_args[inst_axis], function (inst_cat_arg) {
      regl(inst_cat_arg)({
        interp_prop: interpFun(state),
        run_animation: state.animation.running,
      });
    });
    // only show the dendrogram if the current axis is in clust ordering
    if (
      state.order.inst[inst_axis] === "clust" &&
      state.order.new[inst_axis] === "clust"
    ) {
      regl(dendroArgs[inst_axis])();
    }
    // make the arguments for the draw command
    let text_triangle_args;
    if (inst_axis === "col") {
      text_triangle_args = makeColTextArgs(regl, state, zoom_function);
    } else {
      text_triangle_args = makeRowTextArgs(regl, state, zoom_function);
    }
    if (calc_text_tri) {
      const num_viz_labels =
        state.labels["num_" + inst_axis] /
        state.visualization.zoom_data[axis_dim].total_zoom;
      if (
        num_viz_labels < state.max_num_text &&
        state.labels.queue.high[inst_axis].length === 0
      ) {
        calcVizArea(state);
        // only regather if there are more labels than can be shown at once
        if (state.labels["num_" + inst_axis] >= state.max_num_text) {
          gatherTextTriangles(state, inst_axis);
        }
        regl(text_triangle_args)(
          state.visualization.text_triangles.draw[inst_axis]
        );
      }
    } else {
      if (state.visualization.text_triangles.draw[inst_axis] !== false) {
        regl(text_triangle_args)(
          state.visualization.text_triangles.draw[inst_axis]
        );
      }
    }
  });
});
