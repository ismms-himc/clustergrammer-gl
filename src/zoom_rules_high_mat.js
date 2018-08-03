var interactionEvents = require('./interaction-events');
// var normalizedInteractionEvents = require('normalized-interaction-events');
var extend = require('xtend/mutable');
var track_interaction_zoom_data = require('./track_interaction_zoom_data');

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
    if (params.viz_interact){
      track_interaction_zoom_data(regl, params, ev);
    } else {
      console.log('not tracking ', ev.dx, ev.dy);
    }

  })
  .on('interactionend', function(ev){

    // clicking
    // params.animation.time_remain = params.animation.time_remain + 20;
    console.log(ev.type)

  });

  // /////////////////////////////////////////
  // // Alternate interaction tracking
  // /////////////////////////////////////////

  // normalizedInteractionEvents({
  //   element: element
  // })
  // .on('wheel', function (ev) {
  //   // console.log('norm interact: zoom rules');
  //   track_interaction_zoom_data(regl, params, ev);
  // });


};