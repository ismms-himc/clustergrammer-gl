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
    track_interaction_zoom_data(regl, params, ev);
  })
  .on('interactionend', function(){

    // console.log('clicking')

    if (params.animation.time - params.animation.last_click < params.animation.dblclick_duration){
      console.log('double click')
    } else {
      params.animation.last_click = params.animation.time;
    }

  });

};