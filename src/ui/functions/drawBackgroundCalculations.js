import * as _ from "underscore";
import drop_label_from_queue from "../../matrixLabels/dropLabelFromQueue";
import { mutateAnimationState } from "../../state/reducers/animation/animationSlice";
import { mutateLabelsState } from "../../state/reducers/labels/labelsSlice";

export default (function draw_background_calculations(store) {
  const dispatch = store.dispatch;

  _.each(["row", "col"], function (inst_axis) {
    const { labels: oldLabels } = store.getState();
    if (oldLabels.queue.high[inst_axis].length > 0) {
      const inst_name = oldLabels.queue.high[inst_axis][0];
      // TODO: I don't think we need this but
      // const inst_text_vect = vectorize_label(store, inst_axis, inst_name);
      // state.visualization.text_triangles[inst_axis][inst_name] = inst_text_vect;
      const splicedHighQueue = drop_label_from_queue(
        oldLabels.queue.high[inst_axis],
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
        newLabels.queue.high[inst_axis].length === 0 &&
        newLabels.precalc[inst_axis] === false
      ) {
        dispatch(mutateAnimationState({ update_viz: true }));
      }
    }
  });
});
