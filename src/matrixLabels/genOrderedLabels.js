import * as _ from "underscore";

export default function gen_ordered_labels(cgm) {
  // Generate lists of ordered label and category names for mouseover
  const params = cgm.params;
  // debugger;
  let i_order;
  const ordered_labels = {};
  let axis_nodes;
  let i;
  let found_axis_cat;
  _.each(["row", "col"], function (i_axis) {
    ordered_labels[i_axis + "s"] = [];
    ordered_labels[i_axis + "_indices"] = [];
    axis_nodes = params.network[i_axis + "_nodes"];
    found_axis_cat = false;
    // debugger
    for (i = 0; i < params.cat_data.cat_num[i_axis]; i++) {
      ordered_labels[i_axis + "_cats-" + String(i)] = [];
    }
    if (params.cat_data.cat_num[i_axis] > 0) {
      found_axis_cat = true;
    }
    _.each(axis_nodes, function (inst_node, inst_index) {
      i_order =
        params.labels["num_" + i_axis] -
        1 -
        inst_node[params.order.inst[i_axis]];
      // ordered names
      ordered_labels[i_axis + "s"][i_order] = inst_node.name;
      // ordered indices (for value retrieval)
      ordered_labels[i_axis + "_indices"][i_order] = inst_index;
      if (found_axis_cat) {
        for (i = 0; i < params.cat_data.cat_num[i_axis]; i++) {
          ordered_labels[i_axis + "_cats-" + String(i)][i_order] =
            inst_node["cat-" + String(i)];
        }
      }
    });
  });
  params.labels.ordered_labels = ordered_labels;
}
