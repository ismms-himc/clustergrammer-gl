var run_reorder = require('./../reorders/run_reorder');

module.exports = function custom_label_reorder(regl, params, inst_axis){

  // update custom label order
  var full_name;
  if (params.labels.titles[inst_axis] !== ''){
    full_name = params.labels.titles[inst_axis] + ': ' +
                params.int.mouseover[inst_axis].name;
  } else {
    full_name = params.int.mouseover[inst_axis].name;
  }

  var found_label_index = _.indexOf(params.network[inst_axis + '_node_names'],
                                  full_name);

  var mat = params.mat_data;

  var tmp_arr = [];
  var other_axis;
  if (inst_axis === 'col'){
    other_axis = 'row';
    // console.log('col')
    _.each(mat, function(inst_row){
      tmp_arr.push(inst_row[found_label_index]);
    });
  } else {
    // console.log('row')
    other_axis = 'col';
    tmp_arr = mat[found_label_index]
  }

  var tmp_sort = d3.range(tmp_arr.length).sort(function(a, b) {
    return tmp_arr[b] - tmp_arr[a];
  });


  _.map(params.network[other_axis + '_nodes'], function(inst_node, node_index){
    inst_node.custom = params.labels['num_' + other_axis] - tmp_sort[node_index]
  })

  // sort array says which index contains highest lowest values
  // convert to name list
  var ordered_names = [];
  _.map(tmp_sort, function(inst_index){
    ordered_names.push(params.network[other_axis + '_nodes'][inst_index].name);
  })

  params.network[other_axis + '_nodes'].forEach(function(node){
    node.custom = params.labels['num_' + other_axis] - _.indexOf(ordered_names, node.name) - 1;
  })

  run_reorder(regl, params, other_axis, 'custom');

  // unselect reorder buttons
  var button_color = '#eee';
  d3.select(params.root + ' .' + other_axis + '-reorder-buttons')
  .selectAll('rect')
  .style('stroke', button_color);

  // working on passing reordered label to widget if available
  if (params.is_widget){
    console.log('saving to widget')
    params.widget_model.model.set('value', full_name);
  } else {
    console.log('not a widget')
  }


}