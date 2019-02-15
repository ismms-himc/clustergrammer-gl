module.exports = function generate_ol(params){

  /*
    Generate lists of ordered label and category names for mouseover
  */

  var inst_order;
  var ol = {};

  var axis_nodes;
  var i;

  _.each(['row', 'col'], function(i_axis){

    ol[i_axis + 's'] = [];
    ol[i_axis + '_indices'] = [];

    axis_nodes = params.network[i_axis + '_nodes'];

    var found_axis_cat = false;

    for (i = 0; i < params.cat_data.cat_num[i_axis]; i++) {
      ol[i_axis + '_cats-' + String(i)] = [];
    }

    if (params.cat_data.cat_num[i_axis] > 0){
      found_axis_cat = true;
    }

    _.each(axis_nodes, function(inst_node, inst_index){

      inst_order = params.labels['num_' + i_axis] - 1 - inst_node[params.order.inst[i_axis]];

      // ordered names
      ol[i_axis + 's'][inst_order] = inst_node.name;

      // ordered indices (for value retrieval)
      ol[i_axis + '_indices'][inst_order] = inst_index;

      if (found_axis_cat){

        for (i = 0; i < params.cat_data.cat_num[i_axis]; i++) {

          ol[i_axis + '_cats-' + String(i)][inst_order] = inst_node['cat-' + String(i)];

        }
      }

    });

  });

  params.labels.ordered_labels = ol;

};