var interactionEvents = require('./interaction-events');
// var normalizedInteractionEvents = require('normalized-interaction-events');
var extend = require('xtend/mutable');
var track_interaction_zoom_data = require('./track_interaction_zoom_data');
var make_position_arr = require('./make_position_arr');
var make_cat_position_array = require('./make_cat_position_array');

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

    if (ev.x0 < 100 && ev.y0 < 100){


        console.log('CLICKING', ev.type, 'reordring_columns', ev.x0, ev.y0)

        params.animation.run_switch = true;

        if (params.inst_order.col == 'clust'){
          console.log('set new_order to clust')
          params.new_order.col = 'rank'
        } else {
          console.log('set new_order to rank')
          params.new_order.col = 'clust'
        }

        // calculate new ordering
        params.arrs.position_arr.new = make_position_arr(params,
                                        params.new_order.row,
                                        params.new_order.col);

        params.matrix_args.regl_props.rects.attributes.pos_att_new = {
              buffer: regl.buffer(params.arrs.position_arr.new),
              divisor: 1
            };


        // update cat position arrays
        console.log('re-calculating col cat positions', params.new_order.col)
        console.log('---', params.cat_arrs.new.col[0][0])
        for (var cat_index = 0; cat_index < params.cat_num.col; cat_index++) {
          params.cat_arrs.new.col[cat_index] = make_cat_position_array(params, 'col', cat_index, params.new_order.col);

          // update the attribute
          params.cat_args.col[cat_index].attributes.cat_pos_att_new = {
              buffer: regl.buffer(params.cat_arrs.new.col[cat_index]),
              divisor: 1
          };
        }
        console.log('---', params.cat_arrs.new.col[0][0])

        // update matrix args
    }

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