var run_reorder = require('./../reorders/run_reorder');

module.exports = function custom_row_reorder(regl, params){
  console.log('run custom row reordering');

  // update row custom order
  var full_name;
  if (params.labels.titles.row !== ''){
    full_name = params.labels.titles.row + ': ' +
                params.int.mouseover.row.name;
  } else {
    full_name = params.int.mouseover.row.name;
  }

  var found_row_index = _.indexOf(params.network.row_node_names,
                                  full_name);

  var mat = params.mat_data;
  var tmp_arr = [];

  // debugger;

  // _.each(mat, function(inst_row){
  //   tmp_arr.
  // })

  tmp_arr = mat[found_row_index]

  // sort the rows
  var tmp_sort = d3.range(tmp_arr.length).sort(function(a, b) {
    return tmp_arr[b] - tmp_arr[a];
  });

  ////////////////////////////////////////////
  _.map(params.network.col_nodes, function(inst_node, node_index){
    inst_node.custom = params.labels.num_col - tmp_sort[node_index]
  })

  // sort array says which index contains highest lowest values
  // convert to name list
  var ordered_names = [];
  _.map(tmp_sort, function(inst_index){
    ordered_names.push(params.network.col_nodes[inst_index].name);
  })

  params.network.col_nodes.forEach(function(node){
    node.custom = params.labels.num_col - _.indexOf(ordered_names, node.name) - 1;
  })

  run_reorder(regl, params, 'col', 'custom');

}