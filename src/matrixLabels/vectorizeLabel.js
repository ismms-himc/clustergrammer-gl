import { without } from "lodash";
import vectorize_text from "vectorize-text";
import { mutateLabelsState } from "../state/reducers/labels/labelsSlice.js";

export default function vectorize_label(store, inst_axis, inst_name) {
  const dispatch = store.dispatch;
  const { labels } = store.getState();

  const vect_text_attrs = {
    textAlign: "left",
    triangles: true,
    size: labels.font_detail,
    font: '"Open Sans", verdana, arial, sans-serif',
  };
  if (inst_axis === "col") {
    vect_text_attrs.textAlign = "left";
    vect_text_attrs.textBaseline = "bottom";
  } else {
    vect_text_attrs.textAlign = "right";
    vect_text_attrs.textBaseline = "middle";
  }
  const splicedLowQueue = without(
    labels.labels_queue.low[inst_axis],
    inst_name
  );
  dispatch(
    mutateLabelsState({
      labels_queue: {
        low: {
          [inst_axis]: splicedLowQueue,
        },
      },
    })
  );
  return vectorize_text(inst_name, vect_text_attrs);
}
