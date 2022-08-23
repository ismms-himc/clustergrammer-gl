import * as d3 from "d3";
import * as _ from "underscore";
import { setSearchedRows } from "../state/reducers/searchSlice";
import runReorder from "./runReorder";

export default (function custom_label_reorder(
  regl,
  state,
  dispatch,
  catArgsManager,
  mouseover,
  inst_axis
) {
  // update custom label order
  const full_name = mouseover[inst_axis].name;
  const found_label_index = _.indexOf(
    state.network[inst_axis + "_node_names"],
    full_name
  );
  dispatch(setSearchedRows(full_name.split(", ")));
  let tmp_arr = [];
  let other_axis;
  if (inst_axis === "col") {
    other_axis = "row";
    _.each(state.network.mat, function (inst_row) {
      tmp_arr.push(inst_row[found_label_index]);
    });
  } else {
    other_axis = "col";
    tmp_arr = state.network.mat[found_label_index];
  }
  const tmp_sort = d3.range(tmp_arr.length).sort(function (a, b) {
    return tmp_arr[b] - tmp_arr[a];
  });
  const num_other_labels = state.labels["num_" + other_axis];

  // TODO: write to state
  _.map(state.network[other_axis + "_nodes"], function (inst_node, node_index) {
    inst_node.custom = num_other_labels - tmp_sort[node_index];
  });
  // sort array says which index contains highest lowest values
  // convert to name list
  const ordered_names = [];
  _.map(tmp_sort, function (inst_index) {
    ordered_names.push(state.network[other_axis + "_nodes"][inst_index].name);
  });
  // TODO: write to state
  state.network[other_axis + "_nodes"].forEach(function (node) {
    node.custom = num_other_labels - ordered_names.indexOf(node.name) - 1;
  });
  runReorder(regl, state, catArgsManager, other_axis, "custom");
  // unselect reorder buttons
  const button_color = "#eee";
  d3.select(
    state.visualization.rootElementId + " ." + other_axis + "-reorder-buttons"
  )
    .selectAll("rect")
    .style("stroke", button_color);
});
