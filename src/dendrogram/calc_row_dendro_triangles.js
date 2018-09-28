// var underscore = require('underscore');

module.exports = function calc_row_dendro_triangles(params){

  var triangle_info = {};
  var inst_level = params.dendro.group_level.row;
  var row_nodes = params.network.row_nodes;
  // var row_nodes_names = params.network.row_nodes_names;

  _.each(row_nodes, function(inst_node, inst_index){

    // console.log('row_node '+d.name)

    var inst_group = inst_node.group[inst_level];
    // var inst_index = _.indexOf(row_nodes_names, d.name);

    // var inst_top = params.viz.y_scale(inst_index);
    // var inst_bot = inst_top + params.viz.y_scale.rangeBand();

    // console.log(inst_index);

    var inst_top = 1; // params.node_canvas_pos.x_arr[inst_index];
    var inst_bot = 1; // inst_top + params.viz.y_scale.rangeBand();

    if ( _.has(triangle_info, inst_group) === false ){
      triangle_info[inst_group] = {};
      triangle_info[inst_group].name_top = inst_node.name;
      triangle_info[inst_group].name_bot = inst_node.name;
      triangle_info[inst_group].pos_top = inst_top;
      triangle_info[inst_group].pos_bot = inst_bot;
      triangle_info[inst_group].pos_mid = (inst_top + inst_bot)/2;
      triangle_info[inst_group].name = inst_group;
      triangle_info[inst_group].all_names = [];
      triangle_info[inst_group].inst_axis = 'row';
    }

    triangle_info[inst_group].all_names.push(inst_node.name);

    if (inst_top < triangle_info[inst_group].pos_top){
      triangle_info[inst_group].name_top = inst_node.name;
      triangle_info[inst_group].pos_top = inst_top;
      triangle_info[inst_group].pos_mid = (inst_top + triangle_info[inst_group].pos_bot)/2;
    }

    if (inst_bot > triangle_info[inst_group].pos_bot){
      triangle_info[inst_group].name_bot = inst_node.name;
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