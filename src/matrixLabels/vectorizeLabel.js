import vectorize_text from "vectorize-text";
import drop_label_from_queue from "./dropLabelFromQueue";

export default function vectorize_label(params, inst_axis, inst_name) {
  const vect_text_attrs = {
    textAlign: "left",
    triangles: true,
    size: params.labels.font_detail,
    font: '"Open Sans", verdana, arial, sans-serif',
  };
  if (inst_axis === "col") {
    vect_text_attrs.textAlign = "left";
    vect_text_attrs.textBaseline = "bottom";
  } else {
    vect_text_attrs.textAlign = "right";
    vect_text_attrs.textBaseline = "middle";
  }
  drop_label_from_queue(
    params.labels.queue.low[inst_axis],
    inst_axis,
    inst_name
  );
  return vectorize_text(inst_name, vect_text_attrs);
}
