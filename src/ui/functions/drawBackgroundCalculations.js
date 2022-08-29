import { without } from "lodash";
import * as _ from "underscore";
import vectorize_label from "../../matrixLabels/vectorizeLabel.js";
import { mutateAnimationState } from "../../state/reducers/animation/animationSlice.js";
import { mutateLabelsState } from "../../state/reducers/labels/labelsSlice.js";
import { mutateVisualizationState } from "../../state/reducers/visualization/visualizationSlice.js";

export default (function draw_background_calculations(store) {
  const dispatch = store.dispatch;

  _.each(["row", "col"], function (inst_axis) {
    const { labels: oldLabels } = store.getState();
    if (oldLabels.labels_queue.high[inst_axis].length > 0) {
      const inst_name = oldLabels.labels_queue.high[inst_axis][0];
      const inst_text_vect = vectorize_label(store, inst_axis, inst_name);
      store.dispatch(
        mutateVisualizationState({
          text_triangles: {
            [inst_axis]: {
              [inst_name]: inst_text_vect,
            },
          },
        })
      );
      const splicedHighQueue = without(
        oldLabels.labels_queue.high[inst_axis],
        inst_name
      );
      dispatch(
        mutateLabelsState({
          queue: {
            high: {
              [inst_axis]: splicedHighQueue,
            },
          },
        })
      );
      const { labels: newLabels } = store.getState();
      if (
        newLabels.labels_queue.high[inst_axis].length === 0 &&
        newLabels.precalc[inst_axis] === false
      ) {
        dispatch(mutateAnimationState({ update_viz: true }));
      }
    }
  });
});
