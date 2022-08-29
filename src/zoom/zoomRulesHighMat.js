import doubleClicking from "../interactions/doubleClicking.js";
import interactionEvents from "../interactions/interactionEvents.js";
import singleClicking from "../interactions/singleClicking.js";
import track_interaction_zoom_data from "../interactions/trackInteractionZoomData.js";
import run_hide_tooltip from "../tooltip/runHideTooltip.js";

export default function zoom_rules_high_mat(
  regl,
  store,
  catArgsManager,
  camerasManager,
  tooltip_fun
) {
  const state = store.getState();

  const options = {
    element: regl._gl.canvas,
  };
  const element = options.element;
  // ///////////////////////////////////////
  // Original interaction tracking
  // ///////////////////////////////////////
  interactionEvents({
    element: element,
  })
    .on("interaction", function (ev) {
      track_interaction_zoom_data(store, ev);
      run_hide_tooltip(store, tooltip_fun);
    })
    .on("interactionend", function () {
      if (
        state.animation.time - state.animation.last_click <
        state.animation.dblclick_duration
      ) {
        doubleClicking(regl, store, catArgsManager, camerasManager);
      } else {
        singleClicking(
          regl,
          store,
          catArgsManager,
          camerasManager,
          tooltip_fun
        );
      }
    });
}
