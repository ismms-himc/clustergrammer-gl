var interactionEvents = require('./interaction-events');
var extend = require('xtend/mutable');
var zoom_rules_low_mat = require('./zoom_rules_low_mat');
var keep_track_of_interactions = require('./keep_track_of_interactions');

module.exports = function zoom_rules_high_mat(regl, params){

  var zoom_data = params.zoom_data;
  var zoom_restrict = params.zoom_restrict;
  var viz_dim = params.viz_dim;

  var opts = opts || {};
  var options = extend({
      element: opts.element || regl._gl.canvas,
    }, opts || {});

  var element = options.element;

  var interaction_types = ['wheel', 'touch', 'pinch'];

  interactionEvents({
    element: element,
  })
  .on('interaction', function(ev){
    if (ev.buttons || interaction_types.indexOf(ev.type) !== -1)  {

      switch (ev.type) {
        case 'wheel':
          ev.dsx = ev.dsy = Math.exp(-ev.dy / 100);
          ev.dx = ev.dy = 0;
          break;
      }

      // transfer data from ev to zoom_data
      // zoom_data.x.inst_zoom = 1;
      zoom_data.x.inst_zoom = ev.dsx;

      // zoom_data.x.pan_by_drag = 0;
      zoom_data.x.pan_by_drag = ev.dx;

      zoom_data.x.cursor_position = ev.x0;

      // disable y zooming and panning
      ///////////////////////////////////

      // zoom_data.y.inst_zoom = 1;
      zoom_data.y.inst_zoom = ev.dsy;

      // zoom_data.y.pan_by_drag = 0;
      zoom_data.y.pan_by_drag = ev.dy;

      zoom_data.y.cursor_position = ev.y0;

      /*
      Zoom Switch only working for tall matrices not wide matrices
      */

      // set up two-stage zooming
      if (zoom_data.y.total_zoom < zoom_restrict.y.ratio){

        zoom_data.x.inst_zoom = 1;

        // console.log(zoom_data.y.inst_zoom)
        var potential_zoom = zoom_data.y.total_zoom * zoom_data.y.inst_zoom;

        // check potential_zoom
        if (potential_zoom > zoom_restrict.y.ratio){

          // bump x inst_zoom
          zoom_data.x.inst_zoom = potential_zoom / zoom_restrict.y.ratio;

        }

      }

      zoom_data.x = zoom_rules_low_mat(zoom_restrict.x, zoom_data.x,
        viz_dim.mat.x, 'x');

      zoom_data.y = zoom_rules_low_mat(zoom_restrict.y, zoom_data.y,
        viz_dim.mat.y, 'y');

      keep_track_of_interactions(params);

    }
  });

};