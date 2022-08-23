import * as d3 from "d3";
import * as _ from "underscore";
import calcTextOffsets from "../../matrixLabels/calcTextOffsets";
import genOrderedLabels from "../../matrixLabels/genOrderedLabels";
import updateTextTriangleOrder from "../../matrixLabels/updateTextTriangleOrder";
import { mutateAnimationState } from "../../state/reducers/animation/animationSlice";
import { mutateLabelsState } from "../../state/reducers/labels/labelsSlice";
import { mutateOrderState } from "../../state/reducers/order/orderSlice";
import { mutateVisualizationState } from "../../state/reducers/visualization/visualizationSlice";

export default (function end_animation(state, dispatch, catArgsManager) {
  dispatch(
    mutateAnimationState({
      running: false,
      run_animation: false,
    })
  );
  // transfer the new positions to the matrix args attributes
  // TODO: since this is contains a function, we can't put it in redux. What do?
  // regl_props.attributes.pos_att_ini = {
  //   buffer: regl.buffer(state.arrs.position_arr.new),
  //   divisor: 1,
  // };
  // transfer the new category positions to the cat args attributes
  _.each(["row", "col"], function (i_axis) {
    for (
      let cat_index = 0;
      cat_index < state.cat_data.cat_num[i_axis];
      cat_index++
    ) {
      // update the attribute
      catArgsManager.updateCatArgsAttribute(i_axis, cat_index);
    }
    // transfer new order to old order
    const orderInstance = state.order.new[i_axis];
    // turn dendrogram slider back on if necessary
    if (orderInstance === "clust") {
      d3.select("." + i_axis + "_dendro_slider_svg").style("display", "block");
    }
    dispatch(
      mutateOrderState({
        inst: {
          [i_axis]: state.order.new[i_axis],
        },
      })
    );
  });
  // transfer new order to text triangles
  // need to update text positions after animation
  const offset_dict = {};
  const text_triangles_draw = {};
  _.each(["row", "col"], function (i_axis) {
    text_triangles_draw[i_axis] = updateTextTriangleOrder(state, i_axis);
    offset_dict[i_axis] = calcTextOffsets(state, dispatch, i_axis);
  });
  dispatch(
    mutateVisualizationState({
      text_triangles: {
        draw: text_triangles_draw,
      },
    })
  );
  // update ordered_labels
  const ordered_labels = genOrderedLabels(state);
  dispatch(
    mutateLabelsState({
      offset_dict,
      ordered_labels,
    })
  );
});
