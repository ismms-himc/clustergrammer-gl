module.exports = function drop_label_from_queue(params, inst_axis, inst_name){

  var index = params.label_queue[inst_axis].indexOf(inst_name);
  if (index > -1) {
    params.label_queue[inst_axis].splice(index, 1);
  }

};