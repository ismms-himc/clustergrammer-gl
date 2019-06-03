var run_reorder = require('./../reorders/run_reorder');

module.exports = function double_clicking(regl, params){

  console.log('double clicking!!!!');

  // update col custom order
  var full_name;
  if (params.labels.titles.col !== ''){
    full_name = params.labels.titles.col + ': ' +
                params.int.mouseover.col.name;
  } else {
    full_name = params.int.mouseover.col.name;
  }

  var found_col_index = _.indexOf(params.network.col_node_names, full_name);

  var mat = params.mat_data;
  var tmp_arr = [];

  // row_nodes.forEach(function(node, index) {
  //   tmp_arr.push( mat[index].row_data[inst_col].value);
  // });

  _.each(mat, function(inst_row){
    tmp_arr.push(inst_row[found_col_index]);
    // tmp_arr.push(inst_row[28]);
  });

  // sort the cols
  var tmp_sort = d3.range(tmp_arr.length).sort(function(a, b) {
    return tmp_arr[b] - tmp_arr[a];
  });

  _.map(params.network.row_nodes, function(inst_node, node_index){
    inst_node.custom = params.labels.num_row - tmp_sort[node_index]
  })

  // sort array says which index contains highest lowest values
  // convert to name list
  var ordered_names = [];
  _.map(tmp_sort, function(inst_index){
    ordered_names.push(params.network.row_nodes[inst_index].name);
  })

  params.network.row_nodes.forEach(function(node){
    node.custom = params.labels.num_row - _.indexOf(ordered_names, node.name) - 1;
  })

  run_reorder(regl, params, 'row', 'custom');
}