import * as _ from "underscore";

export default (function generate_order_params(params) {
  params.order = {};
  _.each(["inst", "new"], function (inst_state) {
    params.order[inst_state] = {};
    if ("order" in params.network) {
      params.order[inst_state].row = params.network.order.row;
      params.order[inst_state].col = params.network.order.col;
    } else {
      params.order[inst_state].row = "clust";
      params.order[inst_state].col = "clust";
    }
  });
});
