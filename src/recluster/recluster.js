// var clusterfck = require('cornhundred-clusterfck');
var clusterfck = require('../clusterfck_local/clusterfck');
var core = require('mathjs/core');
var math = core.create();
var dist_fun = require('./distance_functions');
var get_order_and_groups_clusterfck_tree = require('./get_order_and_groups_clusterfck_tree');
// var update_view = require('../update/update_view');
// var underscore = require('underscore');

var change_groups = require('./../dendrogram/change_groups');

math.import(require('mathjs/lib/function/matrix/transpose'));
math.import(require('mathjs/lib/type/matrix'));

module.exports = function recluster(distance_metric='cosine', linkage_type='average'){

  var cgm = this;

  console.log('reclustering\n----------------------------------')

  var new_view = {};
  new_view.N_row_sum = 'null';
  new_view.N_row_var = 'null';
  new_view.distance_metric = distance_metric;
  new_view.linkage_type = linkage_type;

  var view_name = distance_metric + '_' + linkage_type;

  new_view.name = view_name;

  // constructing new nodes from old view (does not work when filtering)

  new_view.nodes = {};
  new_view.nodes.row_nodes = _.clone(cgm.params.network.row_nodes);
  new_view.nodes.col_nodes = _.clone(cgm.params.network.col_nodes);

  cgm.params.tree = {}
  _.each(['row', 'col'], function(axis){

    var mat;
    var transpose = math.transpose;
    var names;
    var name_nodes;

    if (axis === 'row'){
      mat = _.clone(cgm.params.network.mat);

      names = cgm.params.network.row_nodes.map(x => x.name.split(': ')[1]);
      name_nodes = 'row_nodes';

    } else if (axis === 'col'){
      mat = _.clone(cgm.params.network.mat);
      mat = transpose(mat);

      names = cgm.params.network.col_nodes.map(x => x.name.split(': ')[1])
      name_nodes = 'col_nodes';
    }

    // average, single, complete
    var clusters = clusterfck.hcluster(mat, dist_fun[distance_metric], linkage_type);

    var order_info = get_order_and_groups_clusterfck_tree(clusters, names, cgm, axis);

    var inst_node;
    var inst_order;

    // row or column nodes
    var rc_nodes = new_view.nodes[name_nodes];

    for (var index=0; index < rc_nodes.length; index++){

      inst_node = rc_nodes[index];
      inst_order = order_info.info[index];

      // console.log(inst_node.name, inst_node.clust)

      inst_node.clust = inst_order.order;
      inst_node.group = inst_order.group;
    }

  });


  // cgm.new_view = new_view

  // run reordering
  require('./../reorders/run_reorder')(cgm.regl, cgm.params, 'row', 'clust');
  require('./../reorders/run_reorder')(cgm.regl, cgm.params, 'col', 'clust');

  let group_level = cgm.params.dendro.group_level
  change_groups(cgm, 'row', group_level.row);
  change_groups(cgm, 'col', group_level.col);

  // // add new view to views
  // cgm.config.network.views.push(new_view);

  // // delay update if menu has not been removed
  // if (d3.select(cgm.params.root+' .tree_menu').empty()){
  //   update_view(cgm, 'name', view_name);
  // } else {
  //   setTimeout(update_view, 500, cgm, 'name', view_name);
  // }

};