module.exports = function get_ordered_labels(params){

  console.log('get ordered_labels')

  var ordered_labels = {};

  row_nodes = params.network.row_nodes;
  col_nodes = params.network.col_nodes;
  ordered_labels.rows = [];
  ordered_labels.cols = [];

  // only showing col cat in mouseover for now
  ordered_labels.col_cats = [];

  var inst_order;
  var inst_name;
  _.each(row_nodes, function(inst_node){
    inst_order = params.num_row - 1 - inst_node[params.inst_order.row];
    ordered_labels.rows[inst_order] = inst_node.name;
  });

  var found_col_cat = false;
  if (params.cat_num.col > 0){
    var found_col_cat = true;
  }

  _.each(col_nodes, function(inst_node){
    inst_order = params.num_col- 1 - inst_node[params.inst_order.col];

    ordered_labels.cols[inst_order] = inst_node.name;

    if (found_col_cat){
      ordered_labels.col_cats[inst_order] = inst_node['cat-0'];
    }

  });

  params.ordered_labels = ordered_labels;
};