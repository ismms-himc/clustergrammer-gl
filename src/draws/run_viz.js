var d3 = require("d3");
_ = require('underscore');
var reset_cameras = require('./../cameras/reset_cameras');
var start_animation = require('./start_animation');
var end_animation = require('./end_animation');
var draw_interacting = require('./draw_interacting');
var draw_mouseover = require('./draw_mouseover');

var draw_background_calculations = require('./draw_background_calculations');

module.exports = function run_viz(external_model){

  var cgm = this;
  var regl = cgm.regl;
  var params = cgm.params;

  // console.log('run_viz, using this')

  params.ani.first_frame = true;

  regl.frame(function ({time}) {

    // console.log('tick')

    params.ani.time = time;

    if (params.int.total > 1){
      d3.selectAll(params.root + ' .group-svg-tooltip')
        .remove();
    }

    // prevent this from being negative, can happen when resetting zoom
    if (params.int.total < 0){
      params.int.total = 0;
    }

    if (params.reset_cameras){
      reset_cameras(regl, params);
    }

    if (params.ani.run_animation){
      start_animation(params);
    } else if (params.ani.time > params.ani.duration_end && params.ani.running === true){
      end_animation(regl, params);
    }

    if (params.int.still_interacting == true ||
        params.ani.ini_viz == true ||
        params.ani.running == true||
        params.ani.update_viz == true){

      draw_interacting(regl, params);

      params.ani.update_viz = false;

      // console.log('still interacting')

    }
    else if (params.int.still_mouseover == true){

      // console.log('still_mouseover')
      // mouseover may result in draw command
      draw_mouseover(regl, params);
      draw_background_calculations(regl, params);
    } else if (params.labels.draw_labels || params.tooltip.show_tooltip || params.dendro.update_dendro){
      cgm.draw_labels_tooltips_or_dendro(external_model);
    } else {
      // run background calculations
      draw_background_calculations(regl, params);
    }

  });

};