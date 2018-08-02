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

  regl.frame(function () {

    // interaction (zoom/drag) causes a draw command
    if (params.still_interacting == true || params.initialize_viz == true){

      params.zoom_data.x.total_int = params.zoom_data.x.total_int + 1;

      draw_commands(regl, params);

      setTimeout(final_interaction_frame, wait_time_final_interact, regl, params);

      params.initialize_viz = false;

    }

    // mouseover interaction starting then ending will cause a draw comand
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


  // function final_interaction_frame(params){

  //   // reduce the number of interactions
  //   params.zoom_data.x.total_int = params.zoom_data.x.total_int - 1;

  //   if (params.zoom_data.x.total_int == 0 && initialize_viz == false){

  //     // preventing from running on first frame
  //     if (first_frame == false){

  //       console.log('\n------------------\nFINAL INTERACTION');
  //       console.log('final interaction', params.mouseover.row_name, params.mouseover.col_name);

  //       // run draw commands
  //       var slow_draw = true;

  //       if (params.zoom_data.x.total_mouseover == 0){
  //         draw_commands(regl, params, slow_draw);
  //       }

  //       // console.log(params.kept_row_y);

  //     } else {
  //       first_frame = false;
  //     }
  //   }

  // }

  return params;

};