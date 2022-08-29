import doubleClicking from "../interactions/doubleClicking";
import interactionEvents from "../interactions/interactionEvents";
import singleClicking from "../interactions/singleClicking";
import track_interaction_zoom_data from "../interactions/trackInteractionZoomData";
import run_hide_tooltip from "../tooltip/runHideTooltip";

export default function zoom_rules_high_mat(
  regl,
  store,
  catArgsManager,
  camerasManager,
  tooltip_fun
) {
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
      const interactionState = store.getState();
      if (
        interactionState.animation.time -
          interactionState.animation.last_click <
        interactionState.animation.dblclick_duration
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
