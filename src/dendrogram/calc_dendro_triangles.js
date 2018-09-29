// var underscore = require('underscore');

module.exports = function calc_row_dendro_triangles(params, inst_axis){

  var triangle_info = {};

  var inst_level = params.dendro.group_level[inst_axis];
  var inst_nodes = params.network[inst_axis + '_nodes'];


  // var row_nodes_names = params.network.row_nodes_names;

  // var inst_axis = 'row';

  var heat_size;
  var tri_width;
  // var heat_shift;
  var num_labels = params.labels['num_'+inst_axis];
  if (inst_axis === 'row'){
    heat_size = params.viz_dim.heat_size.y;
    tri_width = heat_size/num_labels;
    // heat_shift = params.viz_dim.mat_size.y - params.viz_dim.heat_size.y;
  } else {
    heat_size = params.viz_dim.heat_size.x;
    tri_width  = heat_size/num_labels;
    // heat_shift = -(params.viz_dim.mat_size.x - params.viz_dim.heat_size.x);
  }

  var inst_order = params.order.inst[inst_axis];

  _.each(inst_nodes, function(inst_node){

    // console.log('row_node '+d.name)

    var order_index = inst_node[inst_order];

    var inst_group = inst_node.group[inst_level];

    var inst_top;
    if (inst_axis === 'row'){
      inst_top = params.node_canvas_pos.y_arr[order_index];
    } else {
      inst_top = params.node_canvas_pos.x_arr[order_index];
    }

    var inst_bot = inst_top + tri_width;

    var inst_name = inst_node.name;

    console.log(inst_name, order_index, inst_top, inst_bot);

    if (inst_name.indexOf(': ') >= 0){
      inst_name = inst_name.split(': ')[1];
    }

    if ( _.has(triangle_info, inst_group) === false ){
      triangle_info[inst_group] = {};
      triangle_info[inst_group].name_top = inst_name;
      triangle_info[inst_group].name_bot = inst_name;
      triangle_info[inst_group].pos_top = inst_top;
      triangle_info[inst_group].pos_bot = inst_bot;
      triangle_info[inst_group].pos_mid = (inst_top + inst_bot)/2;
      triangle_info[inst_group].name = inst_group;
      triangle_info[inst_group].all_names = [];
      triangle_info[inst_group].inst_axis = inst_axis;
    }

    triangle_info[inst_group].all_names.push(inst_name);

    if (inst_top < triangle_info[inst_group].pos_top){
      triangle_info[inst_group].name_top = inst_name;
      triangle_info[inst_group].pos_top = inst_top;
      triangle_info[inst_group].pos_mid = (inst_top + triangle_info[inst_group].pos_bot)/2;
    }

    if (inst_bot > triangle_info[inst_group].pos_bot){
      triangle_info[inst_group].name_bot = inst_name;
      triangle_info[inst_group].pos_bot = inst_bot;
      triangle_info[inst_group].pos_mid = (triangle_info[inst_group].pos_top + inst_bot)/2;
    }

  });

  var group_info = [];

  _.each(triangle_info, function(inst_triangle){
    group_info.push(inst_triangle);
  });

  return group_info;

};