import * as _ from "underscore";
import { mutateOrderState } from "../../reducers/order/orderSlice";

export default function getInitialOrderState(store) {
  const { network } = store.getState();
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
  store.dispatch(mutateOrderState(order));
}
