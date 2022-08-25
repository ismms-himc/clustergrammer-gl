import * as _ from "underscore";

export default (function calc_dendro_triangles(store, dendro, inst_axis) {
  const state = store.getState();
  const triangle_info = {};
  const inst_nodes = state.network[inst_axis + "_nodes"];
  let heat_shift;
  let heat_size;
  let tri_width;
  const num_labels = state.labels["num_" + inst_axis];
  if (inst_axis === "row") {
    heat_size = state.visualization.viz_dim.heat_size.y;
    tri_width = heat_size / num_labels;
  } else {
    heat_size = state.visualization.viz_dim.heat_size.x;
    tri_width = heat_size / num_labels;
  }
  const inst_order = state.order.inst[inst_axis];
  _.each(inst_nodes, function (inst_node) {
    const order_index = inst_node[inst_order];
    let inst_group;
    if ("linkage" in state.network) {
      // new way of getting group
      // //////////////////////////////////////////
      inst_group = inst_node.group_links;
    } else {
      // original way of getting group
      // //////////////////////////////////////////
      const inst_level = dendro.group_level[inst_axis];
      inst_group = inst_node.group[inst_level];
    }
    let inst_top;
    if (inst_axis === "row") {
      heat_shift =
        state.visualization.viz_dim.mat_size.y -
        state.visualization.viz_dim.heat_size.y;
      inst_top =
        -state.node_canvas_pos.y_arr[order_index] -
        2 * tri_width -
        2 * heat_shift;
    } else {
      // emperical rule
      heat_shift =
        state.visualization.viz_dim.mat_size.x -
        state.visualization.viz_dim.heat_size.x;
      inst_top =
        -state.node_canvas_pos.x_arr[order_index] -
        2 * tri_width +
        2 * heat_shift;
    }
    const inst_bot = inst_top + tri_width;
    let inst_name = inst_node.name;
    if (inst_name.indexOf(": ") >= 0) {
      inst_name = inst_name.split(": ")[1];
    }
    // initialize triangle info for a new group
    if (_.has(triangle_info, inst_group) === false) {
      triangle_info[inst_group] = {};
      triangle_info[inst_group].name_top = inst_name;
      triangle_info[inst_group].name_bot = inst_name;
      triangle_info[inst_group].pos_top = inst_top;
      triangle_info[inst_group].pos_bot = inst_bot;
      triangle_info[inst_group].pos_mid = (inst_top + inst_bot) / 2;
      triangle_info[inst_group].name = inst_group;
      triangle_info[inst_group].all_names = [];
      triangle_info[inst_group].inst_axis = inst_axis;
    }
    triangle_info[inst_group].all_names.push(inst_name);
    if (inst_top < triangle_info[inst_group].pos_top) {
      triangle_info[inst_group].name_top = inst_name;
      triangle_info[inst_group].pos_top = inst_top;
      triangle_info[inst_group].pos_mid =
        (inst_top + triangle_info[inst_group].pos_bot) / 2;
    }
    if (inst_bot > triangle_info[inst_group].pos_bot) {
      triangle_info[inst_group].name_bot = inst_name;
      triangle_info[inst_group].pos_bot = inst_bot;
      triangle_info[inst_group].pos_mid =
        (triangle_info[inst_group].pos_top + inst_bot) / 2;
    }
  });
  const group_info = Object.values(triangle_info);
  return group_info;
});
