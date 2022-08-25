import vectorize_text from "vectorize-text";
import { mutateLabelsState } from "../state/reducers/labels/labelsSlice";
import drop_label_from_queue from "./dropLabelFromQueue";

export default function vectorize_label(store, labels, inst_axis, inst_name) {
  const dispatch = store.dispatch;
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
  const splicedLowQueue = drop_label_from_queue(
    labels.queue.low[inst_axis],
    inst_name
  );
  dispatch(
    mutateLabelsState({
      queue: {
        low: {
          [inst_axis]: splicedLowQueue,
        },
      },
    })
  );
  return vectorize_text(inst_name, vect_text_attrs);
}
