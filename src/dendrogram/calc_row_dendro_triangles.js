// var underscore = require('underscore');

module.exports = function calc_row_dendro_triangles(params){

  var triangle_info = {};
  var inst_level = params.dendro.group_level.row;
  var row_nodes = params.network.row_nodes;
  // var row_nodes_names = params.network.row_nodes_names;

  var inst_axis = 'row';

  var num_labels = params.labels['num_'+inst_axis];
  if (inst_axis === 'row'){
    heat_size = params.viz_dim.heat_size.y;
    tri_width = heat_size/num_labels;
    heat_shift = params.viz_dim.mat_size.y - params.viz_dim.heat_size.y;
  } else {
    heat_size = params.viz_dim.heat_size.x;
    tri_width  = heat_size/num_labels;
    heat_shift = -(params.viz_dim.mat_size.x - params.viz_dim.heat_size.x);
  }

  _.each(row_nodes, function(inst_node, inst_index){

    // console.log('row_node '+d.name)

    var inst_group = inst_node.group[inst_level];
    // var inst_index = _.indexOf(row_nodes_names, d.name);

    // var inst_top = params.viz.y_scale(inst_index);
    // var inst_bot = inst_top + params.viz.y_scale.rangeBand();

    var inst_top = -params.node_canvas_pos.y_arr[inst_index];
    var inst_bot = inst_top + tri_width;

    var inst_name = inst_node.name;

    console.log(inst_name, inst_index, inst_top, inst_bot);

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
      triangle_info[inst_group].inst_axis = 'row';
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