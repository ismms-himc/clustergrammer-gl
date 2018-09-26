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

  params.animation.first_frame = true;


  regl.frame(function ({time}) {

    params.animation.time = time;

    // prevent this from being negative, can happen when resetting zooo
    if (params.interact.total < 0){
      params.interact.total = 0;
    }

    if (params.reset_cameras){
      reset_cameras(regl, params);
    }

    if (params.animation.run_animation){
      start_animation(params);
    } else if (params.animation.time > params.animation.duration_end && params.animation.running === true){
      end_animation(regl, params);
    }

    if (params.interact.still_interacting == true || params.animation.initialize_viz == true || params.animation.running){
      draw_interacting(regl, params);
    }
    else if (params.interact.still_mouseover == true){
      // mouseover may result in draw command
      draw_mouseover(regl, params);
      draw_background_calculations(regl, params);
    } else if (params.labels.draw_labels || params.tooltip.show_tooltip){
      draw_labels_or_tooltips(regl, params);
    } else {
      // run background calculations
      draw_background_calculations(regl, params);
    }

  });

  return params;

};