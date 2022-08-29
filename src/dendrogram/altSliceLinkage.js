import { cloneDeep } from "lodash";
import { setNetworkState } from "../state/reducers/networkSlice";

export default (function alt_slice_linkage(
  store,
  axis,
  dist_thresh,
  min_dist = 0
) {
  const { network } = store.getState();
  const dispatch = store.dispatch;
  let clust_a;
  let clust_b;
  const group_dict = {};
  const newNetwork = cloneDeep(network);

  newNetwork[axis + "_nodes"].forEach((_, i) => {
    group_dict[i] = [i];
  });
  newNetwork[axis + "_nodes"] = newNetwork[axis + "_nodes"].map((node, i) => {
    node.group_links = i;
    return node;
  });
  // the max individual cluster id
  const max_clust_id = newNetwork[axis + "_nodes"].length;
  newNetwork.linkage[axis].forEach((x, i) => {
    if (x[2] > min_dist && x[2] < dist_thresh) {
      // get cluster that are being combined together
      clust_a = x[0];
      clust_b = x[1];
      const new_clust_id = max_clust_id + i;
      // make new array, concat lower level cluster, delete lower level clusters
      group_dict[new_clust_id] = [];
      group_dict[new_clust_id] = group_dict[new_clust_id].concat(
        group_dict[clust_a],
        group_dict[clust_b]
      );
      delete group_dict[clust_a];
      delete group_dict[clust_b];
    }
  });
  // // making dictionary of lists of clusters
  // {
  //   1: ['a', 'b', 'c'],
  //   2: ['d', 'e'],
  // }
  // // making flat dictionary of row/col to cluster
  // {
  //   'a': 1,
  //   'b': 1
  //    ...
  // }
  // Make flat dictionary
  const flat_group_dict = {};
  Object.entries(group_dict).forEach(([inst_cluster, nodes]) => {
    nodes.forEach((x) => {
      flat_group_dict[x] = inst_cluster;
    });
  });
  // transfer to network group_links
  newNetwork[`${axis}_nodes`] = newNetwork[axis + "_nodes"].map((node, i) => ({
    ...node,
    group_links: flat_group_dict[i],
  }));
  dispatch(setNetworkState(newNetwork));
});
