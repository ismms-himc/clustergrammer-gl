module.exports = function get_ordered_labels(params){

  var inst_order;
  var ordered_labels = {};

  var row_nodes = params.network.row_nodes;
  var col_nodes = params.network.col_nodes;
  ordered_labels.rows = [];
  ordered_labels.cols = [];

  // only showing col cat in mouseover for now

  var found_row_cat = false;
  ordered_labels.row_cats = [];
  if (params.cat_num.row > 0){
    found_row_cat = true;
  }

  _.each(row_nodes, function(inst_node){

    inst_order = params.num_row - 1 - inst_node[params.inst_order.row];
    ordered_labels.rows[inst_order] = inst_node.name;

    if (found_row_cat){
      ordered_labels.row_cats[inst_order] = inst_node['cat-0'];
    }

  });

  var found_col_cat = false;
  ordered_labels.col_cats = [];
  if (params.cat_num.col > 0){
    found_col_cat = true;
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