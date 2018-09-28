module.exports = function make_dendro_arr(params, inst_axis){

  var inst_trap;

  // console.log('make_dendro_arr')

  // console.log(params.dendro.group_info.row)

  var group_info;
  if (inst_axis === 'row'){
    group_info = params.dendro.group_info.row
  } else {
    group_info = params.dendro.group_info.row
  }

  var offset_array = [];
  _.each(group_info, function(inst_group){
    // console.log(inst_group.pos_top)

    inst_trap = [inst_group.pos_top, 1];

    offset_array.push(inst_trap);

  });

  // console.log('new', offset_array.length)

  return offset_array;
}