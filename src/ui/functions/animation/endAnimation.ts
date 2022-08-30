import { Store } from "@reduxjs/toolkit";
import { select } from "d3-selection";
import { Regl } from "regl";
import * as _ from "underscore";
import { CamerasManager } from "../../../cameras/camerasManager";
import { CatArgsManager } from "../../../cats/manager/catArgsManager";
import calcTextOffsets from "../../../matrixLabels/calcTextOffsets";
import genOrderedLabels from "../../../matrixLabels/genOrderedLabels";
import updateTextTriangleOrder from "../../../matrixLabels/updateTextTriangleOrder";
import { mutateAnimationState } from "../../../state/reducers/animation/animationSlice";
import {
  LabelsState,
  mutateLabelsState,
} from "../../../state/reducers/labels/labelsSlice";
import {
  mutateOrderState,
  OrderState,
} from "../../../state/reducers/order/orderSlice";
import {
  mutateVisualizationState,
  VisualizationState,
} from "../../../state/reducers/visualization/visualizationSlice";
import { RootState } from "../../../state/store/store";
import { Axis } from "../../../types/general";

export default (function end_animation(
  regl: Regl,
  store: Store<RootState>,
  catArgsManager: CatArgsManager,
  camerasManager: CamerasManager
) {
  const state = store.getState();
  const dispatch = store.dispatch;

  dispatch(
    mutateAnimationState({
      running: false,
      run_animation: false,
    })
  );
  // transfer the new positions to the matrix args attributes
  camerasManager.mutateReglProps({
    attributes: {
      pos_att_ini: {
        buffer: regl.buffer(state.arrs.position_arr.new),
        divisor: 1,
      },
    },
  });
  // transfer the new category positions to the cat args attributes
  _.each(["row", "col"], function (i_axis) {
    for (
      let cat_index = 0;
      cat_index < state.cat_data.cat_num[i_axis];
      cat_index++
    ) {
      // update the attribute
      catArgsManager.updateCatArgsAttribute(i_axis as Axis, cat_index);
    }
    // transfer new order to old order
    const orderInstance = state.order.new[i_axis];
    // turn dendrogram slider back on if necessary
    if (orderInstance === "clust") {
      select("." + i_axis + "_dendro_slider_svg").style("display", "block");
    }
    dispatch(
      mutateOrderState({
        inst: {
          [i_axis]: orderInstance,
        },
      } as Partial<OrderState>)
    );
  });
  // transfer new order to text triangles
  // need to update text positions after animation
  const offset_dict: LabelsState["offset_dict"] = {};
  const text_triangles_draw: Record<string, any> = {};
  _.each(["row", "col"], function (i_axis) {
    text_triangles_draw[i_axis] = updateTextTriangleOrder(store, i_axis);
    offset_dict[i_axis] = calcTextOffsets(store, i_axis);
  });
  dispatch(
    mutateVisualizationState({
      text_triangles: {
        draw: text_triangles_draw,
      } as VisualizationState["text_triangles"],
    })
  );
  // update ordered_labels
  genOrderedLabels(store);
  dispatch(
    mutateLabelsState({
      offset_dict,
    })
  );
});
