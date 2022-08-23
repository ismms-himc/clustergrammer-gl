import * as _ from "underscore";

export default function getInitialOrderState(network) {
  const order = {};
  _.each(["inst", "new"], function (inst_state) {
    order[inst_state] = {};
    if ("order" in network) {
      order[inst_state].row = network.order.row;
      order[inst_state].col = network.order.col;
    } else {
      order[inst_state].row = "clust";
      order[inst_state].col = "clust";
    }
  });
  return order;
}
