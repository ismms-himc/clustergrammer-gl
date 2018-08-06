var initialize_params = require('./initialize_params');
var draw_commands = require('./draw_commands');
_ = require('underscore');
var control = require('control-panel');
var final_mouseover_frame = require('./final_mouseover_frame');
var final_interaction_frame = require('./final_interaction_frame');

module.exports = function run_viz(container, network){

  var regl = require('regl')({
    extensions: ['angle_instanced_arrays'],
    container: container,
    // pixelRatio: window.devicePixelRatio/10
  });

  // var tick = 0;
  // var initialize_viz = true;

  // global params
  var params = initialize_params(regl, network);

  params.first_frame = true;
  var wait_time_final_interact = 100;
  var wait_time_final_mouseover = 100;

  regl.frame(function ({time}) {

    params.time = time;

    params.animation.loop = 0 ; // params.time % 5 /50;

    // if (Math.round(time) % 3 == 0){
    //   console.log('time', time)
    // }

    // console.log(Math.round(time))

    // manually triggering switch
    if (params.run_switch){
      params.run_switch = false;
      params.last_switch_time = time
      // inst_state++
      console.log(params.time, params.last_switch_time)
    };

    // // run draw command
    // if (params.still_interacting == true || params.initialize_viz == true ||
    //     params.animation.time_remain > 0){

      params.zoom_data.x.total_int = params.zoom_data.x.total_int + 1;

      draw_commands(regl, params);

      setTimeout(final_interaction_frame, wait_time_final_interact, regl, params);

      params.initialize_viz = false;

      if (params.animation.time_remain > 0){
        params.animation.time_remain = params.animation.time_remain - 1;
        // console.log('animation: ', params.animation.time_remain);
      }

    // }

    // mouseover may result in draw command
    if (params.still_mouseover == true){

      params.zoom_data.x.total_mouseover = params.zoom_data.x.total_mouseover + 1;

      // remove old tooltip
      if (params.show_tooltip == true){
        params.show_tooltip = false;
        draw_commands(regl, params);
      }

      setTimeout(final_mouseover_frame, wait_time_final_mouseover, regl, params);

    } else {

      /*

        Set up something to run background calculations if
        necessary when the visualization is not being updated. For instance,
        we could calculate the text triangles of all rows a little at a time
        in the background.

      */

    }

  });

  return params;

};