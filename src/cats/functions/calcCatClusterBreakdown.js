import * as _ from "underscore";
import binomTest from "../helpers/binomTest";

export default (function calcCatClusterBreakdown(store, inst_data, inst_rc) {
  const state = store.getState();

  // in case sim_mat
  if (inst_rc === "both") {
    inst_rc = "row";
  }
  // 1: get information for nodes in cluster
  // names of nodes in cluster
  const clust_names = inst_data.all_names;
  const selected_clust_names = clust_names;
  const clust_nodes = [];
  const all_nodes = state.network[inst_rc + "_nodes"];
  let num_in_clust_index = null;
  let is_downsampled = false;
  let i_name;
  _.each(all_nodes, function (i_node) {
    i_name = i_node.name;
    if (i_name.indexOf(": ") >= 0) {
      i_name = i_name.split(": ")[1];
    }
    if (clust_names.indexOf(i_name) >= 0) {
      clust_nodes.push(i_node);
    }
  });
  // 2: find category-types that are string-type: cat_breakdown
  const c_bd = [];
  if (state.cat_viz.cat_info[inst_rc] !== null) {
    const i_cat_info = state.cat_viz.cat_info[inst_rc];
    // tmp list of all categories
    const tmp_types_index = _.keys(i_cat_info);
    // this will hold the indexes of string-type categories
    const cat_types_index = [];
    // get category names (only include string-type categories)
    const cat_types_names = [];
    let type_name;
    let i_index;
    let cat_index;
    for (let i = 0; i < tmp_types_index.length; i++) {
      cat_index = "cat-" + String(i);
      if (state.cat_viz.cat_info[inst_rc][cat_index].type === "cat_strings") {
        type_name = state.cat_viz.cat_names[inst_rc][cat_index];
        cat_types_names.push(type_name);
        cat_types_index.push(cat_index);
      } else {
        // save number in clust category index if found
        if (state.cat_viz.cat_names[inst_rc][cat_index] === "number in clust") {
          num_in_clust_index = cat_index;
          is_downsampled = true;
        }
      }
    }
    const t_run_count = {};
    let i_bd = {};
    let bar_data;
    const radix_param = 10;
    // sort by actual counts (rather than cluster counts)
    let sorting_index = 4;
    if (is_downsampled) {
      sorting_index = 5;
    }
    let no_title_given;
    if (type_name === cat_index) {
      no_title_given = true;
    } else {
      no_title_given = false;
    }
    if (cat_types_names.length > 0) {
      // 3: count instances of each category name for each category-type
      let cat_name;
      const num_in_clust = clust_names.length;
      _.each(cat_types_index, function (tmp_cat_index) {
        i_index = tmp_cat_index.split("-")[1];
        type_name = cat_types_names[i_index];
        if (no_title_given) {
          if (tmp_cat_index.indexOf("-") >= 0) {
            const tmp_num =
              parseInt(tmp_cat_index.split("-")[1], radix_param) + 1;
            type_name = "Category " + String(tmp_num);
          } else {
            // backup behavior
            type_name = "Category";
          }
        }
        t_run_count[type_name] = {};
        // loop through the nodes and keep a running count of categories
        _.each(clust_nodes, function (tmp_node) {
          cat_name = tmp_node[tmp_cat_index];
          if (cat_name.indexOf(": ") >= 0) {
            cat_name = cat_name.split(": ")[1];
          }
          if (cat_name in t_run_count[type_name]) {
            t_run_count[type_name][cat_name].num_nodes =
              t_run_count[type_name][cat_name].num_nodes + 1;
            if (num_in_clust_index !== null) {
              t_run_count[type_name][cat_name].num_nodes_ds =
                t_run_count[type_name][cat_name].num_nodes_ds +
                parseInt(
                  tmp_node[num_in_clust_index].split(": ")[1],
                  radix_param
                );
            }
          } else {
            t_run_count[type_name][cat_name] = {};
            t_run_count[type_name][cat_name].num_nodes = 1;
            if (num_in_clust_index !== null) {
              t_run_count[type_name][cat_name].num_nodes_ds = parseInt(
                tmp_node[num_in_clust_index].split(": ")[1],
                radix_param
              );
            }
          }
        });
        i_bd = {};
        i_bd.type_name = type_name;
        i_bd.num_in_clust = num_in_clust;
        // sort cat info in c_bd
        bar_data = [];
        let bar_color;
        let cat_title_and_name;
        const i_run_count = t_run_count[type_name];

        // TODO: fix
        // eslint-disable-next-line guard-for-in
        for (const i_cat in i_run_count) {
          const tot_num_cat =
            state.cat_viz.cat_info[inst_rc][tmp_cat_index].cat_hist[i_cat];
          const total_nodes = state.network[inst_rc + "_nodes"].length;
          const expect_prob = tot_num_cat / total_nodes;
          // if no cat-title given
          if (no_title_given) {
            cat_title_and_name = i_cat;
          } else {
            cat_title_and_name = type_name + ": " + i_cat;
          }
          // num_nodes: number of cat-nodes drawn in cluster
          const num_nodes = i_run_count[i_cat].num_nodes;
          const actual_k = num_nodes;
          const pval = binomTest(actual_k, num_in_clust, expect_prob);
          // working on tracking the 'real' number of nodes, which is only different
          // if downsampling has been done
          let num_nodes_ds;
          if (_.has(i_run_count[i_cat], "num_nodes_ds")) {
            num_nodes_ds = i_run_count[i_cat].num_nodes_ds;
          } else {
            num_nodes_ds = null;
          }
          bar_color = state.cat_viz.global_cat_colors[i_cat];
          bar_data.push([
            tmp_cat_index,
            cat_title_and_name,
            i_run_count[i_cat],
            bar_color,
            num_nodes,
            num_nodes_ds,
            pval,
          ]);
        }
        bar_data.sort(function (a, b) {
          return b[sorting_index] - a[sorting_index];
        });
        i_bd.bar_data = bar_data;
        c_bd.push(i_bd);
      });
    }
  }
  return { c_bd, selected_clust_names };
});
