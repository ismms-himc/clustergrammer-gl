import * as _ from "underscore";

export default (function calc_viz_area(params) {
  const zoom_data = params.zoom_data;
  const pix_to_webgl = params.pix_to_webgl;
  const buffer_width = 0.0;
  const total_pan = {};
  const viz_area = {};
  const dim = {};
  let inst_dim;
  let label_name;
  let found_label;
  dim.x = "width";
  dim.y = "height";
  const label_dict = {};
  label_dict.x = "col";
  label_dict.y = "row";
  params.labels.visible_labels = {};
  _.each(["x", "y"], function (inst_axis) {
    inst_dim = dim[inst_axis];
    total_pan[inst_axis + "_min"] = -zoom_data[inst_axis].total_pan_min;
    total_pan[inst_axis + "_max"] =
      params.viz_dim.heat[inst_dim] + zoom_data[inst_axis].total_pan_max;
    // x and y axis viz area is defined differently
    if (inst_axis == "x") {
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
    label_name = label_dict[inst_axis];
    params.labels.visible_labels[label_dict[inst_axis]] = [];
    const min_viz = viz_area[inst_axis + "_min"];
    const max_viz = viz_area[inst_axis + "_max"];
    _.each(params.network[label_name + "_nodes"], function (inst_label) {
      if (
        inst_label.offsets.inst > min_viz &&
        inst_label.offsets.inst < max_viz
      ) {
        found_label = inst_label.name;
        if (found_label.indexOf(": ") >= 0) {
          found_label = found_label.split(": ")[1];
        }
        params.labels.visible_labels[label_dict[inst_axis]].push(found_label);
      }
    });
  });
  params.viz_area = viz_area;
});
