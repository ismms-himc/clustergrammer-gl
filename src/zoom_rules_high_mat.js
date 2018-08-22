var interactionEvents = require('./interaction-events');
// var normalizedInteractionEvents = require('normalized-interaction-events');
var extend = require('xtend/mutable');
var track_interaction_zoom_data = require('./track_interaction_zoom_data');
var make_position_arr = require('./make_position_arr');

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

      // example of tracking dragging while clicking (buttons)
      // will set up someting to not track interactions when mousing over
      // buttons and sliders
      if (ev.buttons){
        console.log('not tracking ', ev.dx, ev.dy);
      }

    }

  })
  .on('interactionend', function(ev){

    console.log('CLICKING', ev.type, 'reordring_columns')

    params.animation.run_switch = true;

    if (params.inst_order.col == 'clust'){
      console.log('set new_order to clust')
      params.new_order.col = 'rank'
    } else {
      console.log('set new_order to rank')
      params.new_order.col = 'clust'
    }

    params.arrs.position_arr['new'] = make_position_arr(params,
                                    params.new_order.row,
                                    params.new_order.col);

    params.matrix_args.regl_props.rects.attributes.pos_att_new = {
          buffer: regl.buffer(params.arrs.position_arr['new']),
          divisor: 1
        };

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