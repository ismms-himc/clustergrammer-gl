module.exports = function generate_ordered_labels(params){

  /*
    Generate lists of ordered label and category names for mouseover
  */

  var inst_order;
  var ordered_labels = {};

  var axis_nodes;
  var i;

  _.each(['row', 'col'], function(inst_axis){

    ordered_labels[inst_axis + 's'] = [];
    ordered_labels[inst_axis + '_indices'] = [];

    axis_nodes = params.network[inst_axis + '_nodes'];

    var found_axis_cat = false;

    for (i = 0; i < params.cat_data.cat_num[inst_axis]; i++) {
      ordered_labels[inst_axis + '_cats-' + String(i)] = [];
    }

    if (params.cat_data.cat_num[inst_axis] > 0){
      found_axis_cat = true;
    }

    _.each(axis_nodes, function(inst_node, inst_index){

      inst_order = params.labels['num_' + inst_axis] - 1 - inst_node[params.order.inst[inst_axis]];

      // ordered names
      ordered_labels[inst_axis + 's'][inst_order] = inst_node.name;

      // ordered indices (for value retrieval)
      ordered_labels[inst_axis + '_indices'][inst_order] = inst_index;

      if (found_axis_cat){

        for (i = 0; i < params.cat_data.cat_num[inst_axis]; i++) {

          ordered_labels[inst_axis + '_cats-' + String(i)][inst_order] = inst_node['cat-' + String(i)];

        }
      }

    });

  });

  params.labels.ordered_labels = ordered_labels;

};