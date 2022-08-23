import * as _ from "underscore";

import vectorize_label from "./vectorizeLabel";

export default function gather_text_triangles(
  text_triangles,
  viz_area,
  labels,
  network,
  inst_axis
) {
  let inst_dim;
  if (inst_axis === "col") {
    inst_dim = "x";
  } else {
    inst_dim = "y";
  }
  // generating array with text triangles and y-offsets
  const draw = {};
  draw[inst_axis] = [];
  const min_viz = viz_area[inst_dim + "_min"];
  const max_viz = viz_area[inst_dim + "_max"];
  const label_queue_high = {};
  const text_triangles_col_and_row = {
    col: {},
    row: {},
  };
  _.each(network[inst_axis + "_nodes"], function (inst_label) {
    if (
      inst_label.offsets.inst > min_viz &&
      inst_label.offsets.inst < max_viz
    ) {
      let inst_name = inst_label.name;
      if (inst_name.indexOf(": ") >= 0) {
        inst_name = inst_label.name.split(": ")[1];
      }
      let inst_text_vect;
      if (inst_name in text_triangles[inst_axis]) {
        // add to text_triangles.draw if pre-calculated
        inst_text_vect = text_triangles[inst_axis][inst_name];
        inst_text_vect.inst_offset = [0, inst_label.offsets.inst];
        inst_text_vect.new_offset = [0, inst_label.offsets.new];
        draw[inst_axis].push(inst_text_vect);
      } else {
        // TODO: wtf
        label_queue_high[inst_axis] = [];
        label_queue_high[inst_axis].push(inst_name);
        /*
                moved text triangle calculations to background, unless pre-calc
                */
        if (labels.precalc[inst_axis]) {
          // calculate text vector
          inst_text_vect = vectorize_label(labels, inst_axis, inst_name);
          text_triangles_col_and_row[inst_axis][inst_name] = inst_text_vect;
          inst_text_vect.inst_offset = [0, inst_label.offsets.inst];
          inst_text_vect.new_offset = [0, inst_label.offsets.new];
          text_triangles.draw[inst_axis].push(inst_text_vect);
        }
      }
    }
    return { draw, lqh: label_queue_high, text_triangles_col_and_row };
  });
}
