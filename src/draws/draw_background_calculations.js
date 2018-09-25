// var draw_commands = require('./draw_commands');
var vectorize_label = require('./../matrix_labels/vectorize_label');

module.exports = function draw_background_calculations(regl, params){

  /*
    Set up something to run background calculations if
    necessary when the visualization is not being updated. For instance,
    we could calculate the text triangles of all rows a little at a time
    in the background.
  */

  // var updated_labels = false;
  _.each(['row', 'col'], function(inst_axis){

    // high priority queue
    if (params.label_queue.high[inst_axis].length > 0){

      var inst_name = params.label_queue.high[inst_axis][0];
      // add to text_triangles pre-calc
      var inst_text_vect = vectorize_label(params, inst_axis, inst_name);
      params.text_triangles[inst_axis][inst_name] = inst_text_vect;

      var inst_offset = params.labels.offset_dict[inst_axis][inst_name];

      inst_text_vect.inst_offset = [0, inst_offset.inst];
      inst_text_vect.new_offset = [0, inst_offset.new];
      params.text_triangles.draw[inst_axis].push(inst_text_vect);

      params.draw_labels = true;

    } else {
      // console.log('finished high queue')
    }

  });

  /*
    Need to draw if high priority queue is updated, not if low priority queue is
    updated
  */

  // // run draw in the same loop, do not wait until next animation loop
  // if (updated_labels){
  //   // console.log('draw updated labels')
  //   draw_commands(regl, params);
  // }

};