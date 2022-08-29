import * as _ from "underscore";
import genPixToWebgl from "./genPixToWebgl";

export default (function calcVizArea(store) {
  const { visualization } = store.getState();
  const pix_to_webgl = genPixToWebgl(visualization.viz_dim);
  const zoom_data = visualization.zoom_data;
  const buffer_width = 0.0;
  const total_pan = {};
  const viz_area = {};
  const dim = {};
  let inst_dim;
  dim.x = "width";
  dim.y = "height";
  const label_dict = {};
  label_dict.x = "col";
  label_dict.y = "row";
  _.each(["x", "y"], function (inst_axis) {
    inst_dim = dim[inst_axis];
    total_pan[inst_axis + "_min"] = -zoom_data[inst_axis].total_pan_min;
    total_pan[inst_axis + "_max"] =
      visualization.viz_dim.heat[inst_dim] + zoom_data[inst_axis].total_pan_max;
    // x and y axis viz area is defined differently
    if (inst_axis === "x") {
      viz_area[inst_axis + "_min"] =
        pix_to_webgl[inst_axis](total_pan[inst_axis + "_min"]) - buffer_width;
      viz_area[inst_axis + "_max"] =
        pix_to_webgl[inst_axis](total_pan[inst_axis + "_max"]) + buffer_width;
    } else {
      viz_area[inst_axis + "_min"] =
        pix_to_webgl[inst_axis](total_pan[inst_axis + "_max"]) - buffer_width;
      viz_area[inst_axis + "_max"] =
        pix_to_webgl[inst_axis](total_pan[inst_axis + "_min"]) + buffer_width;
    }
  });

  return viz_area;
});
