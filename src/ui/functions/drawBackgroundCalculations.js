import * as _ from "underscore";
import vectorize_label from "../../matrixLabels/vectorizeLabel";
import { mutateAnimationState } from "../../state/reducers/animation/animationSlice";
import { dropFromLabelQueue } from "../../state/reducers/labels/labelsSlice";
import { mutateVisualizationState } from "../../state/reducers/visualization/visualizationSlice";

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
      dispatch(
        dropFromLabelQueue({ queue: "high", axis: inst_axis, label: inst_name })
      );
      const { labels: newLabels } = store.getState();

      // once all the high priority labels have been processed in the background,
      // run the visualization
      if (
        newLabels.labels_queue.high[inst_axis].length === 0 &&
        newLabels.precalc[inst_axis] === false
      ) {
        dispatch(mutateAnimationState({ update_viz: true }));
      }
    }
  });
});
