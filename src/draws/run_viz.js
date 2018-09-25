var initialize_params = require('./../params/initialize_params');
var draw_commands = require('./draw_commands');
_ = require('underscore');
var vectorize_label = require('./../matrix_labels/vectorize_label');
var reset_cameras = require('./../cameras/reset_cameras');
var start_animation = require('./start_animation');
var end_animation = require('./end_animation');
var draw_interacting = require('./draw_interacting');
var draw_mouseover = require('./draw_mouseover');

module.exports = function run_viz(regl, network){

  // global params
  var params = initialize_params(regl, network);

  params.first_frame = true;


  regl.frame(function ({time}) {

    // console.log(params.zoom_data.x.total_int)

    // prevent this from being negative, can happen when resetting zooo
    if (params.zoom_data.x.total_int < 0){
      params.zoom_data.x.total_int = 0;
    }

    params.time = time;
    params.animation.loop = 0 ;

    if (params.reset_cameras){
      reset_cameras(regl, params);
    }

    var duration_end_time = params.animation.last_switch_time + params.animation.switch_duration;

    if (params.animation.run_switch){

      start_animation(params);

    } else if (params.time > duration_end_time && params.animation.running === true){

      end_animation(regl, params);

    }

    // run draw command
    if (params.still_interacting == true || params.initialize_viz == true || params.animation.running){

      draw_interacting(regl, params);

    }

    // mouseover may result in draw command
    else if (params.still_mouseover == true){

      draw_mouseover(regl, params);

    } else if (params.draw_labels || params.show_tooltip){

      // turn back on draw_labels
      ///////////////////////////////

      // console.log('slow_draw or show_tooltip');

      draw_commands(regl, params);
      params.remove_tooltip_frame = true;

      // set up extra frame specifically to remove old tooltip
      if (params.show_tooltip){
        params.show_tooltip = false;
        // console.log('initialize remove_tooltip_frame')
      }

    } else {

      /*

        Set up something to run background calculations if
        necessary when the visualization is not being updated. For instance,
        we could calculate the text triangles of all rows a little at a time
        in the background.

      */

      var updated_labels = false;
      _.each(['row', 'col'], function(inst_axis){
        if (params.label_high_queue[inst_axis].length > 0){
          var inst_name = params.label_high_queue[inst_axis][0];
          params.text_triangles[inst_axis][inst_name] = vectorize_label(params, inst_axis, inst_name);

          /*
            updated the text_triangles axis, but need to update the draw
          */

          // console.log(inst_name, params.label_high_queue[inst_axis].length)
          updated_labels = true;
        }
      });

      if (updated_labels){
        // console.log('draw updated labels')
        draw_commands(regl, params);
      }

    }

  });

  return params;

};