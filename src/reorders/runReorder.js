import * as d3 from "d3";
import { cloneDeep, merge } from "lodash";
import updateTextTriangleOrder from "../matrixLabels/updateTextTriangleOrder.js";
import { mutateAnimationState } from "../state/reducers/animation/animationSlice.js";
import { setOrderState } from "../state/reducers/order/orderSlice.js";
import { setVisualizationState } from "../state/reducers/visualization/visualizationSlice.js";
import reorderCatArgs from "./reorderCatArgs.js";
import reorderMatrixArgs from "./reorderMatrixArgs.js";

export default (function runReorder(
  regl,
  store,
  catArgsManager,
  camerasManager,
  inst_axis,
  ini_new_order
) {
  const dispatch = store.dispatch;
  const new_order = ini_new_order
    .replace("sum", "rank")
    .replace("var", "rankvar");
  if (new_order !== "clust") {
    d3.select("." + inst_axis + "_dendro_slider_svg").style("display", "none");
  }

  dispatch(mutateAnimationState({ run_animation: true }));

  const state = store.getState();
  const newVisualizationState = cloneDeep(state.visualization);
  const newOrderState = merge(state.order, {
    new: {
      [inst_axis]: new_order,
    },
  });
  dispatch(setOrderState(newOrderState));
  reorderMatrixArgs(regl, store, camerasManager);
  reorderCatArgs(store, catArgsManager);

  const reorderedState = store.getState();
  // either update the existing draw text_triangles or trash them
  if (
    newVisualizationState.text_triangles.draw[inst_axis] !== false &&
    reorderedState.labels["num_" + inst_axis] <= reorderedState.max_num_text
  ) {
    newVisualizationState.text_triangles.draw[inst_axis] =
      updateTextTriangleOrder(store, inst_axis);
  } else {
    newVisualizationState.text_triangles.draw[inst_axis] = false;
  }
  dispatch(setVisualizationState(newVisualizationState));
});
