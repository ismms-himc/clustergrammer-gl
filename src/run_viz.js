var initialize_params = require('./initialize_params');
var draw_commands = require('./draw_commands');
_ = require('underscore');
var final_mouseover_frame = require('./final_mouseover_frame');
var final_interaction_frame = require('./final_interaction_frame');

module.exports = function run_viz(regl, network){

  // global params
  var params = initialize_params(regl, network);

  params.first_frame = true;
  var wait_time_final_interact = 100;
  var wait_time_final_mouseover = 100;


  regl.frame(function ({time}) {

    // console.log(params.slow_draw)

    params.time = time;
    params.animation.loop = 0 ;

    if (params.animation.run_switch){
      console.log('turn switch off')
      params.animation.run_switch = false;
      params.animation.last_switch_time = time
      params.animation.running = true;
    } else if (params.time > params.animation.last_switch_time + params.animation.switch_duration && cgm.params.animation.running === true){

      cgm.params.animation.running = false;
      params.animation.run_switch = false;
      console.log('finish switch!!!!!!!!!!!');

      params.matrix_args.regl_props.rects.attributes.pos_att_ini = {
            buffer: regl.buffer(params.arrs.position_arr['new']),
            divisor: 1
          };

    }

    // run draw command
    if (params.still_interacting == true || params.initialize_viz == true ||
        // params.animation.running || params.show_tooltip){
        params.animation.running){

      params.zoom_data.x.total_int = params.zoom_data.x.total_int + 1;

      draw_commands(regl, params);

      setTimeout(final_interaction_frame, wait_time_final_interact, regl, params);

      params.initialize_viz = false;

      if (params.animation.time_remain > 0){
        params.animation.time_remain = params.animation.time_remain - 1;
        // console.log('animation: ', params.animation.time_remain);
      }

      // // set up extra frame specifically to remove old tooltip
      // if (params.show_tooltip){
      //   params.show_tooltip = false;
      //   console.log('initialize remove_tooltip_frame')
      //   params.remove_tooltip_frame = true;
      // }

    }

    // mouseover may result in draw command
    else if (params.still_mouseover == true){

      // console.log('still_mouseover', params.remove_tooltip_frame)

      /////////////////////////////////////
      /////////////////////////////////////
      // mouseover draw is causing some flashing after animation, clean up later
      ////////////////////////////////////
      /////////////////////////////////////

      params.zoom_data.x.total_mouseover = params.zoom_data.x.total_mouseover + 1;

      // remove old tooltip
      if (params.remove_tooltip_frame){
        // console.log('remove old tooltip ***********')
        params.show_tooltip = false;
        draw_commands(regl, params);
      }

      if (params.remove_tooltip_frame){
          // console.log('--- shut down remove_tooltip_frame')
        params.remove_tooltip_frame = false;
      }

      // wait_time_final_mouseover = 0;
      setTimeout(final_mouseover_frame, wait_time_final_mouseover, regl, params);

    } else if (params.slow_draw || params.show_tooltip){

      // console.log('SLOW DRAW!!!!!!!!!!!!!!')
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

    }


  });

  return params;

};