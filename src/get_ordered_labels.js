module.exports = function get_ordered_labels(params  ){

  var ordered_labels = {};

  row_nodes = params.network.row_nodes;
  col_nodes = params.network.col_nodes;
  ordered_labels.rows = [];
  ordered_labels.cols = [];

  var inst_order;
  var inst_name;
  _.each(row_nodes, function(inst_node){
    inst_order = params.num_row - 1 - inst_node[params.inst_order.row];
    inst_name = inst_node.name;
    ordered_labels.rows[inst_order] = inst_name;
  });

  _.each(col_nodes, function(inst_node){
    inst_order = params.num_col- 1 - inst_node[params.inst_order.col];
    inst_name = inst_node.name;
    ordered_labels.cols[inst_order] = inst_name;
  });

  return ordered_labels;
};