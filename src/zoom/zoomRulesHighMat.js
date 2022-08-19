import extend from "xtend/mutable";
import double_clicking from "../interactions/doubleClicking";
import interactionEvents from "../interactions/interactionEvents";
import track_interaction_zoom_data from "../interactions/trackInteractionZoomData";
import run_hide_tooltip from "../tooltip/runHideTooltip";

export default function zoom_rules_high_mat(cgm, external_model) {
  const regl = cgm.regl;
  const params = cgm.params;
  const opts = opts || {};
  const options = extend(
    {
      element: opts.element || regl._gl.canvas,
    },
    opts || {}
  );
  const element = options.element;
  // ///////////////////////////////////////
  // Original interaction tracking
  // ///////////////////////////////////////
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
