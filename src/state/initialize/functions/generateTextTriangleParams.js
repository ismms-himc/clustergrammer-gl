import * as _ from "underscore";
import gather_text_triangles from "../../../matrixLabels/gatherTextTriangles";
import { mutateLabelsState } from "../../reducers/labels/labelsSlice";
import { mutateVisualizationState } from "../../reducers/visualization/visualizationSlice";

export default (function generateTextTriangleParams(store, viz_area) {
  const { labels, visualization } = store.getState();
  // save text triangles for later use
  const text_triangles = {
    row: {},
    col: {},
    draw: {},
  };
  store.dispatch(
    mutateVisualizationState({
      text_triangles,
    })
  );

  const precalc = {};
  _.each(["row", "col"], function (inst_axis) {
    precalc[inst_axis] =
      labels["num_" + inst_axis] < visualization.max_num_text;
    store.dispatch(
      mutateLabelsState({
        precalc,
      })
    );
    // initial drawing of labels
    if (precalc[inst_axis] === false) {
      text_triangles.draw = {};
      text_triangles.draw[inst_axis] = false;
    } else {
      gather_text_triangles(store, viz_area, inst_axis);
    }
  });

  // visualization updates
  store.dispatch(
    mutateVisualizationState({
      text_triangles,
    })
  );
});
