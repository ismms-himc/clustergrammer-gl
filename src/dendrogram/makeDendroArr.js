export default (function make_dendro_arr(params, inst_axis) {
  let inst_trap;
  let group_info;
  if (inst_axis === "row") {
    group_info = params.dendro.group_info.row;
  } else {
    group_info = params.dendro.group_info.col;
  }
  const offset_array = [];
  let num_in_group;
  _.each(group_info, function (inst_group) {
    num_in_group = inst_group.all_names.length;
    inst_trap = [inst_group.pos_top, num_in_group];
    offset_array.push(inst_trap);
  });
  return offset_array;
});
