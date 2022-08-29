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
  store,
  catArgsManager,
  cameras,
  inst_axis,
  calc_text_tri = false
) {
  const state = store.getState();

  let axis_dim;
  if (inst_axis === "col") {
    axis_dim = "x";
  } else {
    axis_dim = "y";
  }
  /* Axis Components */
  cameras[inst_axis + "-labels"].draw(() => {
    // viz aid triangles
    const viz_aid_tri_args = makeVizAidTriArgs(regl, store, inst_axis);
    regl(viz_aid_tri_args)();
    // drawing the label categories and dendrogram using the same camera as the
    // matrix (no special zooming required)

    const cat_args = catArgsManager.getCatArgs();
    _.each(cat_args[inst_axis], function (inst_cat_arg) {
      regl(inst_cat_arg)({
        interp_prop: interpFun(store),
        run_animation: state.animation.running,
      });
    });
    // only show the dendrogram if the current axis is in clust ordering
    if (
      state.order.inst[inst_axis] === "clust" &&
      state.order.new[inst_axis] === "clust"
    ) {
      const dendroArgs = makeDendroArgs(regl, store, inst_axis);
      regl(dendroArgs)();
    }
    // make the arguments for the draw command
    let text_triangle_args;
    if (inst_axis === "col") {
      text_triangle_args = makeColTextArgs(regl, store, zoom_function);
    } else {
      text_triangle_args = makeRowTextArgs(regl, store, zoom_function);
    }
    if (calc_text_tri) {
      const num_viz_labels =
        state.labels["num_" + inst_axis] /
        state.visualization.zoom_data[axis_dim].total_zoom;
      if (
        num_viz_labels < state.visualization.max_num_text &&
        state.labels.labels_queue.high[inst_axis].length === 0
      ) {
        const viz_area = calcVizArea(store);

        // only regather if there are more labels than can be shown at once
        if (
          state.labels["num_" + inst_axis] >= state.visualization.max_num_text
        ) {
          gatherTextTriangles(store, viz_area, inst_axis);
        }
        regl(text_triangle_args)(
          store.getState().visualization.text_triangles.draw[inst_axis]
        );
      }
    } else {
      if (state.visualization.text_triangles.draw[inst_axis] !== false) {
        regl(text_triangle_args)(
          store.getState().visualization.text_triangles.draw[inst_axis]
        );
      } else {
        console.error(`didn't draw ${inst_axis} axis labels!`);
      }
    }
  });
});
