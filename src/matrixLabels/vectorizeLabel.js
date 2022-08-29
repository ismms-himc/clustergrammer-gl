import vectorize_text from "vectorize-text";
import { dropFromLabelQueue } from "../state/reducers/labels/labelsSlice";

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
  dispatch(
    dropFromLabelQueue({ queue: "low", axis: inst_axis, label: inst_name })
  );
  return vectorize_text(inst_name, vect_text_attrs);
}
