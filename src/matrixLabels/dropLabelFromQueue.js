module.exports = function drop_label_from_queue(
  inst_queue,
  inst_axis,
  inst_name
) {
  var index = inst_queue.indexOf(inst_name);
  if (index > -1) {
    inst_queue.splice(index, 1);
  }
};
