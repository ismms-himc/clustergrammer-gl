module.exports = function calc_text_offsets(params, inst_axis) {
  params.labels.offset_dict[inst_axis] = {};

  _.each(params.network[inst_axis + "_nodes"], function (inst_label, inst_id) {
    var offsets = {};
    var order_id;
    var order_state;

    var inst_dim;
    if (inst_axis === "col") {
      inst_dim = "x";
    } else {
      inst_dim = "y";
    }

    var axis_arr = params.canvas_pos[inst_dim + "_arr"];
    var inst_order = params.order.inst[inst_axis];
    var new_order = params.order.new[inst_axis];
    var num_labels = params.labels["num_" + inst_axis];

    // calculate inst and new offsets
    _.each(["inst", "new"], function (inst_state) {
      if (inst_state === "inst") {
        order_state = inst_order;
      } else {
        order_state = new_order;
      }

      if (inst_axis === "col") {
        order_id = params.network[inst_axis + "_nodes"][inst_id][order_state];
        offsets[inst_state] =
          axis_arr[num_labels - 1 - order_id] + 0.5 / num_labels;
      } else {
        order_id =
          num_labels -
          1 -
          params.network[inst_axis + "_nodes"][inst_id][order_state];
        offsets[inst_state] = axis_arr[order_id] + 0.5 / num_labels;
      }
    });

    inst_label.offsets = offsets;

    // will use for lookup of text offsets outside of using network_data

    var inst_name = inst_label.name;
    if (inst_name.indexOf(": ") >= 0) {
      inst_name = inst_label.name.split(": ")[1];
    }

    params.labels.offset_dict[inst_axis][inst_name] = offsets;
  });
};
