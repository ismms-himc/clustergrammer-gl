var update_text_triangle_order = require('./../matrix_labels/update_text_triangle_order');
var calc_text_offsets = require('./../matrix_labels/calc_text_offsets');
var generate_ordered_labels = require('./../matrix_labels/generate_ordered_labels');

module.exports = function end_animation(regl, params){

  // console.log('end_animation')

  ///////////////////////////////////////
  // The animation has finished
  ///////////////////////////////////////

  params.animation.running = false;
  params.animation.run_animation = false;

  // transfer the new positions to the matrix args attributes
  params.matrix_args.regl_props.rects.attributes.pos_att_ini = {
        buffer: regl.buffer(params.arrs.position_arr.new),
        divisor: 1
      };

  // transfer the new category positions to the cat args attributes
  _.each(['row', 'col'], function(inst_axis){

    for (var cat_index = 0; cat_index < params.cat_data.cat_num[inst_axis]; cat_index++) {
      // update the attribute
      params.cat_args[inst_axis][cat_index].attributes.cat_pos_att_inst = {
          buffer: regl.buffer(params.cat_arrs.new[inst_axis][cat_index]),
          divisor: 1
      };
    }

    // transfer new order to old order
    params.order.inst[inst_axis] = params.order.new[inst_axis]

  });

  // transfer new order to text triangles
  _.each(['row', 'col'], function(inst_axis){
    params.text_triangles.draw[inst_axis] = update_text_triangle_order(params, inst_axis);

    // need to update text positions after animation
    calc_text_offsets(params, inst_axis);
  });

  // update ordered_labels
  generate_ordered_labels(params);

};