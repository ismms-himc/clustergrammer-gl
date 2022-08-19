import * as core from "mathjs/core";
import * as transpose from "mathjs/lib/function/matrix/transpose";
import matrix from "mathjs/lib/type/matrix";
import * as cf from "tayden-clusterfck";
import change_groups from "../dendrogram/changeGroups";
import runReorder from "../reorders/runReorder";
import dist_fun from "./distanceFunctions";
import get_order_and_groups_clusterfck_tree from "./getOrderAndGroupsClusterfckTree";

const math = core.create();
math.import(transpose);
math.import(matrix);

export default function recluster(
  cgm,
  distance_metric = "cosine",
  linkage_type = "average"
) {
  const new_view = {};
  new_view.N_row_sum = "null";
  new_view.N_row_var = "null";
  new_view.distance_metric = distance_metric;
  new_view.linkage_type = linkage_type;
  const view_name = distance_metric + "_" + linkage_type;
  new_view.name = view_name;
  // constructing new nodes from old view (does not work when filtering)
  new_view.nodes = {};
  new_view.nodes.row_nodes = _.clone(cgm.params.network.row_nodes);
  new_view.nodes.col_nodes = _.clone(cgm.params.network.col_nodes);
  cgm.params.tree = {};
  _.each(["row", "col"], function (axis) {
    let mat;
    const transpose = math.transpose;
    let names;
    let name_nodes;
    if (axis === "row") {
      mat = _.clone(cgm.params.network.mat);
      names = cgm.params.network.row_nodes.map((x) => x.name.split(": ")[1]);
      name_nodes = "row_nodes";
    } else if (axis === "col") {
      mat = _.clone(cgm.params.network.mat);
      mat = transpose(mat);
      names = cgm.params.network.col_nodes.map((x) => x.name.split(": ")[1]);
      name_nodes = "col_nodes";
    }
    // average, single, complete
    const clusters = cf.hcluster(mat, dist_fun[distance_metric], linkage_type);
    const order_info = get_order_and_groups_clusterfck_tree(
      clusters,
      names,
      cgm,
      axis
    );
    let inst_node;
    let inst_order;
    // row or column nodes
    const rc_nodes = new_view.nodes[name_nodes];
    for (let index = 0; index < rc_nodes.length; index++) {
      inst_node = rc_nodes[index];
      inst_order = order_info.info[index];
      inst_node.clust = inst_order.order;
      inst_node.group = inst_order.group;
    }
  });
  // run reordering
  runReorder(cgm.regl, cgm.params, "row", "clust");
  runReorder(cgm.regl, cgm.params, "col", "clust");
  const group_level = cgm.params.dendro.group_level;
  change_groups(cgm, "row", group_level.row);
  change_groups(cgm, "col", group_level.col);
}
