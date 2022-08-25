import * as d3 from "d3";
import * as _ from "underscore";
import { mutateNetworkState } from "../state/reducers/networkSlice";
import { setSearchedRows } from "../state/reducers/searchSlice";
import runReorder from "./runReorder";

export default (function custom_label_reorder(
  regl,
  store,
  catArgsManager,
  camerasManager,
  mouseover,
  inst_axis
) {
  const dispatch = store.dispatch;
  const { labels, network: oldNetwork } = store.getState();
  // update custom label order
  const full_name = mouseover[inst_axis].name;
  const found_label_index = _.indexOf(
    oldNetwork[inst_axis + "_node_names"],
    full_name
  );
  dispatch(setSearchedRows(full_name.split(", ")));
  let tmp_arr = [];
  let other_axis;
  if (inst_axis === "col") {
    other_axis = "row";
    _.each(oldNetwork.mat, function (inst_row) {
      tmp_arr.push(inst_row[found_label_index]);
    });
  } else {
    other_axis = "col";
    tmp_arr = oldNetwork.mat[found_label_index];
  }
  const tmp_sort = d3.range(tmp_arr.length).sort(function (a, b) {
    return tmp_arr[b] - tmp_arr[a];
  });
  const num_other_labels = labels["num_" + other_axis];

  // TODO: remove? since this wasn't assigned to anything and was a map, I think it was actually useless code
  // dispatch(
  //   mutateNetworkState({
  //     [other_axis + "_nodes"]: _.map(
  //       store.getState().network[other_axis + "_nodes"],
  //       function (inst_node, node_index) {
  //         inst_node.custom = num_other_labels - tmp_sort[node_index];
  //       }
  //     ),
  //   })
  // );

  // sort array says which index contains highest lowest values
  // convert to name list
  const { network: newNetwork } = store.getState();
  const ordered_names = [];
  _.map(tmp_sort, function (inst_index) {
    ordered_names.push(newNetwork[other_axis + "_nodes"][inst_index].name);
  });

  dispatch(
    mutateNetworkState({
      [other_axis + "_nodes"]: _.map(
        store.getState().network[other_axis + "_nodes"],
        function (inst_node, node_index) {
          inst_node.custom =
            num_other_labels - ordered_names.indexOf(inst_node.name) - 1;
        }
      ),
    })
  );

  runReorder(regl, store, catArgsManager, camerasManager, other_axis, "custom");
  // unselect reorder buttons
  const button_color = "#eee";
  const { visualization } = store.getState();
  d3.select(
    visualization.rootElementId + " ." + other_axis + "-reorder-buttons"
  )
    .selectAll("rect")
    .style("stroke", button_color);
});
