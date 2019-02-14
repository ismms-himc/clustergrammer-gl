var vectorize_label = require('./../matrix_labels/vectorize_label');
var drop_label_from_queue = require('./../matrix_labels/drop_label_from_queue');

module.exports = function draw_background_calculations(regl, params){

  _.each(['row', 'col'], function(inst_axis){

    if (params.labels.queue.high[inst_axis].length > 0){

      var inst_name = params.labels.queue.high[inst_axis][0];

      var inst_text_vect = vectorize_label(params, inst_axis, inst_name);
      params.text_triangles[inst_axis][inst_name] = inst_text_vect;

      drop_label_from_queue(params.labels.queue.high[inst_axis], inst_axis, inst_name);

      if (params.labels.queue.high[inst_axis].length == 0 &&
          params.labels.precalc[inst_axis] == false){
        params.ani.update_viz = true;
      }

    }

  });
};