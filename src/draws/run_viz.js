var initialize_params = require('./../params/initialize_params');
_ = require('underscore');
var reset_cameras = require('./../cameras/reset_cameras');
var start_animation = require('./start_animation');
var end_animation = require('./end_animation');
var draw_interacting = require('./draw_interacting');
var draw_mouseover = require('./draw_mouseover');
var draw_labels_or_tooltips = require('./draw_labels_or_tooltips');
var draw_background_calculations = require('./draw_background_calculations');

module.exports = function run_viz(regl, network){

  // global params
  var params = initialize_params(regl, network);

  params.first_frame = true;


  regl.frame(function ({time}) {

    // prevent this from being negative, can happen when resetting zooo
    if (params.zoom_data.x.total_int < 0){
      params.zoom_data.x.total_int = 0;
    }

    params.time = time;

    if (params.reset_cameras){
      reset_cameras(regl, params);
    }

    if (params.animation.run_switch){
      start_animation(params);
    } else if (params.time > params.animation.duration_end && params.animation.running === true){
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
      draw_labels_or_tooltips(regl, params);
    } else {
      draw_background_calculations(regl, params);
    }

  });

  return params;

};