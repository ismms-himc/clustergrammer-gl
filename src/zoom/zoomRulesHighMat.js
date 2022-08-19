var interactionEvents = require("./../interactions/interaction-events");
var extend = require("xtend/mutable");
var track_interaction_zoom_data = require("./../interactions/trackInteractionZoomData");
var run_hide_tooltip = require("./../tooltip/runHideTooltip");
var double_clicking = require("./../interactions/doubleClicking");

module.exports = function zoom_rules_high_mat(regl, params, external_model) {
  var cgm = this;
  var opts = opts || {};
  var options = extend(
    {
      element: opts.element || regl._gl.canvas,
    },
    opts || {}
  );

  var element = options.element;

  /////////////////////////////////////////
  // Original interaction tracking
  /////////////////////////////////////////

  interactionEvents({
    element: element,
  })
    .on("interaction", function (ev) {
      track_interaction_zoom_data(regl, params, ev);

      run_hide_tooltip(params);
    })
    .on("interactionend", function () {
      if (
        params.ani.time - params.ani.last_click <
        params.ani.dblclick_duration
      ) {
        double_clicking(regl, params);
      } else {
        cgm.single_clicking(params, external_model);
      }
    });
};
