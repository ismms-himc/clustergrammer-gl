module.exports = function get_ordered_labels(params){

  var inst_order;
  var ordered_labels = {};

  var col_nodes = params.network.col_nodes;
  ordered_labels.rows = [];
  ordered_labels.cols = [];

  // only showing col cat in mouseover for now

  var axis_nodes;
  _.each(['row', 'col'], function(inst_axis){

    axis_nodes = params.network[inst_axis + '_nodes'];

    var found_axis_cat = false;
    ordered_labels[inst_axis + '_cats'] = [];
    if (params.cat_num[inst_axis] > 0){
      found_axis_cat = true;
    }

    _.each(axis_nodes, function(inst_node){

      inst_order = params['num_' + inst_axis] - 1 - inst_node[params.inst_order[inst_axis]];
      ordered_labels[inst_axis + 's'][inst_order] = inst_node.name;

      if (found_axis_cat){
        ordered_labels[inst_axis + '_cats'][inst_order] = inst_node['cat-0'];
      }

    });

  });

  params.ordered_labels = ordered_labels;
};