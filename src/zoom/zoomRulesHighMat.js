import extend from "xtend/mutable";
import double_clicking from "../interactions/doubleClicking.js";
import interactionEvents from "../interactions/interactionEvents.js";
import track_interaction_zoom_data from "../interactions/trackInteractionZoomData.js";
import run_hide_tooltip from "../tooltip/runHideTooltip.js";

export default function zoom_rules_high_mat(cgm, external_model) {
  const regl = cgm.regl;
  const params = cgm.params;
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
        cgm.single_clicking(cgm, params, external_model);
      }
    });
}
