import draw_interacting from "../draws/drawInteracting";
import double_clicking from "../interactions/doubleClicking";
import interactionEvents from "../interactions/interactionEvents";
import single_clicking from "../interactions/singleClicking";
import track_interaction_zoom_data from "../interactions/trackInteractionZoomData";
import run_hide_tooltip from "../tooltip/runHideTooltip";

export default function zoom_rules_high_mat(cgm, external_model) {
  const regl = cgm.regl;
  const params = cgm.params;
  const options = {
    element: regl._gl.canvas,
  };
  const element = options.element;
  // ///////////////////////////////////////
  // Original interaction tracking
  // ///////////////////////////////////////
  let interactionData; // TODO: could maybe do a pubsub for this?
  interactionEvents({
    element: element,
  })
    .on("interaction", function (ev) {
      interactionData = track_interaction_zoom_data(regl, params, ev);
      run_hide_tooltip(params);
      draw_interacting(cgm, interactionData.mouseover, external_model);
    })
    .on("interactionend", function () {
      if (
        params.ani.time - params.ani.last_click <
        params.ani.dblclick_duration
      ) {
        double_clicking(regl, params);
      } else {
        single_clicking(params, interactionData.mouseover, external_model);
      }
    });

  return interactionData;
}
