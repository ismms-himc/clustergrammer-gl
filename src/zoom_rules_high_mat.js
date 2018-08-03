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

  interactionEvents({
    element: element,
  })
  .on('interaction', function(ev){

    track_interaction_zoom_data(regl, params, ev);

  })
  .on('interactionend', function(ev){

    // clicking
    console.log(ev.type)

    // params.animation.time_remain = params.animation.time_remain + 20;
  });

/////////////////////////////////////////
// Alternate interaction tracking
/////////////////////////////////////////

// normalizedInteractionEvents({
//   element: element
// })
// .on('wheel', function (ev) {
//   // console.log(event);

//       switch (ev.type) {
//         case 'wheel':
//           ev.dsx = ev.dsy = Math.exp(-ev.dy / 100);
//           ev.dx = ev.dy = 0;
//           break;
//       }

//       // transfer data from ev to zoom_data
//       zoom_data.x.inst_zoom = ev.dsx;
//       zoom_data.x.pan_by_drag = ev.dx;
//       zoom_data.x.cursor_position = ev.x0;

//       zoom_data.y.inst_zoom = ev.dsy;
//       zoom_data.y.pan_by_drag = ev.dy;
//       zoom_data.y.cursor_position = ev.y0;

// });


};