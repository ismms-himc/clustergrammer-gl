import { Store } from "@reduxjs/toolkit";
import { select } from "d3-selection";
import { cloneDeep, range } from "lodash";
import { Regl } from "regl";
import * as _ from "underscore";
import { CamerasManager } from "../cameras/camerasManager";
import { CatArgsManager } from "../cats/manager/catArgsManager";
import { mutateNetworkState } from "../state/reducers/networkSlice";
import { setSearchedRows } from "../state/reducers/searchSlice";
import { RootState } from "../state/store/store";
import { Axis } from "../types/general";
import runReorder from "./runReorder";

export default (function customLabelReorder(
  regl: Regl,
  store: Store<RootState>,
  catArgsManager: CatArgsManager,
  camerasManager: CamerasManager,
  inst_axis: Axis
) {
  const dispatch = store.dispatch;
  const {
    interaction: { mouseover },
    labels,
    network: oldNetwork,
  } = store.getState();
  // update custom label order
  const full_name = mouseover[inst_axis].name;
  const found_label_index = _.indexOf(
    oldNetwork[inst_axis + "_node_names"],
    full_name
  );
  dispatch(setSearchedRows(full_name.split(", ")));
  let tmp_arr: any[] | undefined = [];
  let other_axis: Axis;
  if (inst_axis === "col") {
    other_axis = "row";
    if (oldNetwork.mat) {
      _.each(oldNetwork.mat, function (inst_row) {
        tmp_arr?.push(inst_row[found_label_index]);
      });
    }
  } else {
    other_axis = "col";
    if (oldNetwork.mat) {
      _.each(oldNetwork.mat, function (inst_row) {
        tmp_arr = oldNetwork.mat?.[found_label_index];
      });
    }
  }
  const tmp_sort = range(tmp_arr.length).sort(function (a, b) {
    return tmp_arr?.[b] - tmp_arr?.[a];
  });
  const num_other_labels = labels["num_" + other_axis];

  const { network } = store.getState();
  const newNetwork = cloneDeep(network);
  dispatch(
    mutateNetworkState({
      [other_axis + "_nodes"]: _.map(
        newNetwork[other_axis + "_nodes"],
        function (inst_node, node_index) {
          inst_node.custom = num_other_labels - tmp_sort[node_index];
          return inst_node;
        }
      ),
    })
  );

  // sort array says which index contains highest lowest values
  // convert to name list
  const ordered_names: any[] = [];
  _.map(tmp_sort, function (inst_index) {
    ordered_names.push(newNetwork[other_axis + "_nodes"][inst_index].name);
  });

  const newAxisNodes = _.map(
    newNetwork[other_axis + "_nodes"],
    function (inst_node) {
      inst_node.custom =
        num_other_labels - ordered_names.indexOf(inst_node.name) - 1;
    }
  );

  dispatch(
    mutateNetworkState({
      [other_axis + "_nodes"]: newAxisNodes,
    })
  );

  runReorder(regl, store, catArgsManager, camerasManager, other_axis, "custom");
  // unselect reorder buttons
  const button_color = "#eee";
  const { visualization } = store.getState();
  select(visualization.rootElementId + " ." + other_axis + "-reorder-buttons")
    .selectAll("rect")
    .style("stroke", button_color);
});
