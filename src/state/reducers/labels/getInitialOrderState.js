import * as _ from "underscore";

export default function getInitialOrderState(state) {
  const order = {};
  _.each(["inst", "new"], function (inst_state) {
    order[inst_state] = {};
    if ("order" in state.network) {
      order[inst_state].row = state.network.order.row;
      order[inst_state].col = state.network.order.col;
    } else {
      order[inst_state].row = "clust";
      order[inst_state].col = "clust";
    }
  });
  return order;
}
