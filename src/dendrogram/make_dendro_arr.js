module.exports = function make_dendro_arr(params, inst_axis){

  var inst_trap;

  // console.log('make_dendro_arr')

  // console.log(params.dendro.group_info.row)

  var group_info;
  if (inst_axis === 'row'){
    group_info = params.dendro.group_info.row;
  } else {
    group_info = params.dendro.group_info.col;
  }

  var offset_array = [];
  var num_in_group;
  _.each(group_info, function(inst_group){
    // console.log(inst_group.pos_top)

    num_in_group = inst_group.all_names.length;
    inst_trap = [inst_group.pos_top, num_in_group];

    offset_array.push(inst_trap);

  });

  // console.log('new', offset_array.length)

  // console.log(inst_axis, offset_array)

  return offset_array;
}