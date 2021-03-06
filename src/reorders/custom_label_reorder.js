var d3 = require("d3");
var run_reorder = require('./../reorders/run_reorder');

module.exports = function custom_label_reorder(regl, params, inst_axis){

  // update custom label order
  var full_name;

  full_name = params.int.mouseover[inst_axis].name;

  var found_label_index = _.indexOf(params.network[inst_axis + '_node_names'],
                                  full_name);



  params.search.searched_rows = full_name.split(', ')

  var tmp_arr = [];
  var other_axis;
  if (inst_axis === 'col'){
    other_axis = 'row';
    _.each(params.mat_data, function(inst_row){
      tmp_arr.push(inst_row[found_label_index]);
    });
  } else {
    other_axis = 'col';
    tmp_arr = params.mat_data[found_label_index]
  }

  var tmp_sort = d3.range(tmp_arr.length).sort(function(a, b) {
    return tmp_arr[b] - tmp_arr[a];
  });

  let num_other_labels = params.labels['num_' + other_axis]
  _.map(params.network[other_axis + '_nodes'], function(inst_node, node_index){
    inst_node.custom = num_other_labels - tmp_sort[node_index]
  })

  // sort array says which index contains highest lowest values
  // convert to name list
  var ordered_names = [];
  _.map(tmp_sort, function(inst_index){
    ordered_names.push(params.network[other_axis + '_nodes'][inst_index].name);
  })

  params.network[other_axis + '_nodes'].forEach(function(node){
    node.custom = num_other_labels - ordered_names.indexOf(node.name) - 1;
  })

  run_reorder(regl, params, other_axis, 'custom');

  // unselect reorder buttons
  var button_color = '#eee';
  d3.select(params.root + ' .' + other_axis + '-reorder-buttons')
  .selectAll('rect')
  .style('stroke', button_color);


}