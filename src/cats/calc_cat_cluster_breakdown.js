/* eslint-disable guard-for-in */

var binom_test = require('./binom_test');

module.exports = function calc_cat_cluster_breakdown(params, i_data, i_rc){

  // in case sim_mat
  if (i_rc === 'both'){
    i_rc = 'row';
  }

  // 1: get information for nodes in cluster
  // names of nodes in cluster
  var clust_names = i_data.all_names;
  var clust_nodes = [];
  var all_nodes = params.network[i_rc+'_nodes'];
  var num_in_clust_index = null;
  var is_downsampled = false;

  var i_name;
  _.each(all_nodes, function(i_node){

    i_name = i_node.name;

    if (i_name.indexOf(': ') >= 0){
      i_name = i_name.split(': ')[1];
    }

    if(clust_names.indexOf(i_name) >= 0){
      clust_nodes.push(i_node);
    }

  });

  // 2: find category-types that are string-type: cat_breakdown
  var c_bd = [];

  if ( params.viz.cat_info[i_rc] !== null ){

    var i_cat_info = params.viz.cat_info[i_rc];

    // tmp list of all categories
    var tmp_types_index = _.keys(i_cat_info);
    // this will hold the indexes of string-type categories
    var cat_types_index = [];

    // get category names (only include string-type categories)
    var cat_types_names = [];
    var type_name;
    var i_index;
    var cat_index;
    for (var i = 0; i < tmp_types_index.length; i++) {

      cat_index = 'cat-' + String(i);

      // debugger;

      if (params.viz.cat_info[i_rc][cat_index].type === 'cat_strings'){
        type_name = params.viz.cat_names[i_rc][cat_index];
        cat_types_names.push(type_name);
        cat_types_index.push(cat_index);
      } else {

        // save number in clust category index if found
        if (params.viz.cat_names[i_rc][cat_index] === 'number in clust'){
          num_in_clust_index = cat_index;
          is_downsampled = true;
        }

      }

    }

    var t_run_count = {};
    var i_bd = {};
    var bar_data;
    var radix_param = 10;

    // sort by actual counts (rather than cluster counts)
    var sorting_index = 4;
    if (is_downsampled){
      sorting_index = 5;
    }

    var no_title_given;
    if (type_name === cat_index){
      no_title_given = true;
    } else {
      no_title_given = false;
    }

    if (cat_types_names.length > 0){

      // 3: count instances of each category name for each category-type
      var cat_name;
      var num_in_clust = clust_names.length;

      _.each(cat_types_index, function(tmp_cat_index){

        i_index = tmp_cat_index.split('-')[1];
        type_name = cat_types_names[i_index];

        if (no_title_given){
          if (tmp_cat_index.indexOf('-') >=0){
            var tmp_num = parseInt( tmp_cat_index.split('-')[1], radix_param) + 1;
            type_name = 'Category ' + String(tmp_num);
          } else {
            // backup behavior
            type_name = 'Category';
          }
        }

        t_run_count[type_name] = {};

        // loop through the nodes and keep a running count of categories
        _.each(clust_nodes, function (tmp_node){

          cat_name = tmp_node[tmp_cat_index];

          if (cat_name.indexOf(': ') >=0){
            cat_name = cat_name.split(': ')[1];
          }

          if (cat_name in t_run_count[type_name]){
            t_run_count[type_name][cat_name].num_nodes = t_run_count[type_name][cat_name].num_nodes + 1;

            if (num_in_clust_index !== null){
              t_run_count[type_name][cat_name].num_nodes_ds = t_run_count[type_name][cat_name].num_nodes_ds + parseInt(tmp_node[num_in_clust_index].split(': ')[1], radix_param);
            }

          } else {

            t_run_count[type_name][cat_name] = {};
            t_run_count[type_name][cat_name].num_nodes = 1;
            if (num_in_clust_index !== null){
              t_run_count[type_name][cat_name].num_nodes_ds = parseInt(tmp_node[num_in_clust_index].split(': ')[1], radix_param);
            }

          }

        });

        i_bd = {};
        i_bd.type_name = type_name;
        i_bd.num_in_clust = num_in_clust;

        // sort cat info in c_bd
        bar_data = [];
        var bar_color;
        var cat_title_and_name;
        var i_run_count = t_run_count[type_name];

        for (var i_cat in i_run_count){

          var tot_num_cat = params.viz.cat_info[i_rc][tmp_cat_index].cat_hist[i_cat];
          var total_nodes = params.network[i_rc+'_nodes'].length;
          var expect_prob = tot_num_cat / total_nodes;

          // if no cat-title given
          if (no_title_given){
            cat_title_and_name = i_cat;
          } else {
            cat_title_and_name = type_name + ': ' + i_cat;
          }

          // num_nodes: number of cat-nodes drawn in cluster
          var num_nodes = i_run_count[i_cat].num_nodes;

          var actual_k  = num_nodes;
          var pval = binom_test(actual_k, num_in_clust, expect_prob);

          // working on tracking the 'real' number of nodes, which is only different
          // if downsampling has been done
          if (_.has(i_run_count[i_cat], 'num_nodes_ds')){
            var num_nodes_ds = i_run_count[i_cat].num_nodes_ds;
          } else {
            num_nodes_ds = null;
          }

          bar_color = params.viz.cat_colors[i_rc][tmp_cat_index][cat_title_and_name];

          bar_data.push([ tmp_cat_index, cat_title_and_name, i_run_count[i_cat], bar_color, num_nodes, num_nodes_ds, pval]);
        }

        bar_data.sort(function(a, b) {
            return b[sorting_index] - a[sorting_index];
        });

        i_bd.bar_data = bar_data;

        c_bd.push(i_bd);

      });

    }
  }

  return c_bd;
};