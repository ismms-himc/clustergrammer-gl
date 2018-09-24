module.exports = function calc_text_offsets(params, inst_axis, inst_id){

  var offsets = {};
  var order_id;
  var order_state;

  var inst_dim;
  if (inst_axis === 'col'){
    inst_dim = 'x';
  } else {
    inst_dim = 'y';
  }

  var axis_arr = params.canvas_pos[inst_dim + '_arr'];
  var inst_order = params.inst_order[inst_axis];
  var new_order = params.new_order[inst_axis];
  var num_labels = params['num_' + inst_axis];

  // calculate inst and new offsets
  _.each(['inst', 'new'], function(inst_state){

    if (inst_state === 'inst'){
      order_state = inst_order
    } else {
       order_state = new_order
    }

    if (inst_axis === 'col'){
      order_id = params.network[inst_axis + '_nodes'][inst_id][order_state];
      offsets[inst_state] = axis_arr[ (num_labels - 1) - order_id ] + 0.5/num_labels;
    } else {
      order_id = num_labels - 1 - params.network[inst_axis + '_nodes'][inst_id][order_state];
      offsets[inst_state] = axis_arr[ order_id ] + 0.5/num_labels;
    }

  });

  return offsets;

};