import * as _ from "underscore";
import { mutateLabelsState } from "../state/reducers/labels/labelsSlice";

export default function genOrderedLabels(store) {
  const state = store.getState();
  const { network, labels, cat_data, order } = state;
  // Generate lists of ordered label and category names for mouseover
  let i_order;
  const ordered_labels = {};
  let axis_nodes;
  let i;
  let found_axis_cat;
  _.each(["row", "col"], function (i_axis) {
    ordered_labels[i_axis + "s"] = [];
    ordered_labels[i_axis + "_indices"] = [];
    axis_nodes = network[i_axis + "_nodes"];
    found_axis_cat = false;
    for (i = 0; i < cat_data.cat_num[i_axis]; i++) {
      ordered_labels[i_axis + "_cats-" + String(i)] = [];
    }
    if (cat_data.cat_num[i_axis] > 0) {
      found_axis_cat = true;
    }
    _.each(axis_nodes, function (inst_node, inst_index) {
      i_order = labels["num_" + i_axis] - 1 - inst_node[order.inst[i_axis]];
      // ordered names
      ordered_labels[i_axis + "s"][i_order] = inst_node.name;
      // ordered indices (for value retrieval)
      ordered_labels[i_axis + "_indices"][i_order] = inst_index;
      if (found_axis_cat) {
        for (i = 0; i < cat_data.cat_num[i_axis]; i++) {
          ordered_labels[i_axis + "_cats-" + String(i)][i_order] =
            inst_node["cat-" + String(i)];
        }
      }
    });
  });

  store.dispatch(
    mutateLabelsState({
      ordered_labels,
    })
  );
}
