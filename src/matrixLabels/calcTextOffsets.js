import { cloneDeep } from "lodash";
import * as _ from "underscore";
import { mutateNetworkState } from "../state/reducers/networkSlice";

export default (function calcTextOffsets(store, inst_axis) {
  const state = store.getState();

  const offset_dict = {};
  const newNetworkNodes = cloneDeep(state.network[inst_axis + "_nodes"]);
  _.each(newNetworkNodes, function (inst_label, inst_id) {
    const offsets = {};
    let order_id;
    let order_state;
    let inst_dim;
    if (inst_axis === "col") {
      inst_dim = "x";
    } else {
      inst_dim = "y";
    }
    const axis_arr = state.rowAndColCanvasPositions[inst_dim + "_arr"];
    const inst_order = state.order.inst[inst_axis];
    const new_order = state.order.new[inst_axis];
    const num_labels = state.labels["num_" + inst_axis];
    // calculate inst and new offsets
    _.each(["inst", "new"], function (inst_state) {
      if (inst_state === "inst") {
        order_state = inst_order;
      } else {
        order_state = new_order;
      }
      if (inst_axis === "col") {
        order_id = newNetworkNodes[inst_id][order_state];
        offsets[inst_state] =
          axis_arr[num_labels - 1 - order_id] + 0.5 / num_labels;
      } else {
        order_id = num_labels - 1 - newNetworkNodes[inst_id][order_state];
        offsets[inst_state] = axis_arr[order_id] + 0.5 / num_labels;
      }
    });
    inst_label.offsets = offsets;
    // will use for lookup of text offsets outside of using network_data
    let inst_name = inst_label.name;
    if (inst_name.indexOf(": ") >= 0) {
      inst_name = inst_label.name.split(": ")[1];
    }
    offset_dict[inst_name] = offsets;
  });
  store.dispatch(
    mutateNetworkState({
      [inst_axis + "_nodes"]: newNetworkNodes,
    })
  );
  return offset_dict;
});
