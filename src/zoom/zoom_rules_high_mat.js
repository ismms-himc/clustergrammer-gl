var interactionEvents = require('./../interactions/interaction-events');
var extend = require('xtend/mutable');
var track_interaction_zoom_data = require('./../interactions/track_interaction_zoom_data');

module.exports = function zoom_rules_high_mat(regl, params){

  var opts = opts || {};
  var options = extend({
      element: opts.element || regl._gl.canvas,
    }, opts || {});

  var element = options.element;

  /////////////////////////////////////////
  // Original interaction tracking
  /////////////////////////////////////////

  interactionEvents({
    element: element,
  })
  .on('interaction', function(ev){

    // working on toggling tracking for cases when we need to ignore
    // (e.g. moving a slider)
    if (params.interact.enable_viz_interact){
      track_interaction_zoom_data(regl, params, ev);
    } else {

      // example of tracking dragging while clicking (buttons)
      // will set up someting to not track interactions when mousing over
      // buttons and sliders
      if (ev.buttons){
        // console.log('not tracking ', ev.dx, ev.dy);
      }

    }

  })
  .on('interactionend', function(){

    // console.log('clicking')
  });

};