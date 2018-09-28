module.exports = function make_dendro_arr(params, inst_axis){
  var heat_size;
  var shift_heat;
  if (inst_axis === 'row'){
    heat_size = params.viz_dim.heat_size.y;
    shift_heat = params.viz_dim.mat_size.y - params.viz_dim.heat_size.y;
  } else if (inst_axis === 'col'){
    heat_size = params.viz_dim.heat_size.x;
    shift_heat = -(params.viz_dim.mat_size.x - params.viz_dim.heat_size.x);
  }

  var num_labels = params.labels['num_' + inst_axis];
  var tri_width = heat_size/num_labels;

  var inst_trap;

  console.log('make_dendro_arr')

  var offset_array = [];
  for (var inst_index=0; inst_index < num_labels; inst_index++){

    var trap_width_scale;
    if (inst_axis === 'row'){
      trap_width_scale = 0.15 * inst_index;
    } else {
      trap_width_scale = 0.15 * (num_labels - inst_index - 1);
    }

    // add in additional element for width scale
    inst_trap = [heat_size - shift_heat - 2 * tri_width * inst_index, trap_width_scale];
    offset_array.push(inst_trap) ;
  }

  console.log('old', offset_array.length)

  console.log(params.dendro.group_info.row)

  var offset_array = [];
  _.each(params.dendro.group_info.row, function(inst_group){
    console.log(inst_group.pos_top)

    inst_trap = [inst_group.pos_top, 1];

    offset_array.push(inst_trap);

  });

  console.log('new', offset_array.length)

  return offset_array;
}