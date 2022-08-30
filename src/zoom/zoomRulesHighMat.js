import doubleClicking from "../interactions/doubleClicking";
import interactionEvents from "../interactions/interactionEvents";
import singleClicking from "../interactions/singleClicking";
import track_interaction_zoom_data from "../interactions/trackInteractionZoomData";

export default function zoom_rules_high_mat(
  regl,
  store,
  catArgsManager,
  camerasManager,
  onClick
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
      // run_hide_tooltip(store, tooltip_fun);
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
        singleClicking(store, onClick);
      }
    });
}
