var interactionEvents = require('./../interactions/interaction-events');
var extend = require('xtend/mutable');
var track_interaction_zoom_data = require('./../interactions/track_interaction_zoom_data');
var hide_d3_tip = require('./../tooltip/hide_d3_tip');
var double_clicking = require('./../interactions/double_clicking');

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

    hide_d3_tip(params);

    // console.log(params.int.mouseover.row.name, params.int.mouseover.col.name)

  })
  .on('interactionend', function(){


    if (params.ani.time - params.ani.last_click < params.ani.dblclick_duration){

      double_clicking(regl, params);

    } else {

      params.ani.last_click = params.ani.time;

    }

  });

};