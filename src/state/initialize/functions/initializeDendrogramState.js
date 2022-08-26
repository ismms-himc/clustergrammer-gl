import * as _ from "underscore";
import alt_slice_linkage from "../../../dendrogram/altSliceLinkage";
import calc_dendro_triangles from "../../../dendrogram/calcDendroTriangles";
import { mutateDendrogramState } from "../../reducers/dendrogramSlice";

export default (function initializeDendrogramState(store) {
  const { network } = store.getState();

  const dendro = {};
  dendro.default_level = 5;
  dendro.tri_height = 0.1;
  dendro.trap_height = 0.03;
  dendro.trap_float = 0.005;
  dendro.dendro_args = {};
  dendro.group_level = {};
  dendro.update_dendro = false;
  dendro.group_info = {};
  dendro.default_link_level = 0.5;
  dendro.output_label_format = "list";
  dendro.min_dist = {};
  dendro.min_dist.row = 0; // 0.75
  dendro.min_dist.col = 0; // 0.75
  if ("linkage" in network) {
    dendro.precalc_linkage = true;
    // initial slices of linkage matrix
    // ////////////////////////////////////////////////////
    let link_mat;
    dendro.max_linkage_dist = {};
    let dist_thresh;
    const axes = ["col", "row"];
    axes.forEach((axis) => {
      link_mat = network.linkage[axis];
      dendro.max_linkage_dist[axis] = link_mat[link_mat.length - 1][2] + 0.01;
      dist_thresh = dendro.max_linkage_dist[axis] * dendro.default_link_level;
      // alternate linkage slicing code
      alt_slice_linkage(store, axis, dist_thresh, dendro.min_dist[axis]);
    });
  } else {
    dendro.precalc_linkage = false;
  }
  dendro.increment_buttons = false;
  _.each(["row", "col"], function (axis) {
    dendro.group_level[axis] = dendro.default_level;
    dendro.group_info[axis] = calc_dendro_triangles(store, dendro, axis);
  });
  store.dispatch(mutateDendrogramState(dendro));
});
