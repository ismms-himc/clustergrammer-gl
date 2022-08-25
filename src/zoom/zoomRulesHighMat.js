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
  const state = store.getState();
  const dispatch = store.dispatch;

  const options = {
    element: regl._gl.canvas,
  };
  const element = options.element;
  // ///////////////////////////////////////
  // Original interaction tracking
  // ///////////////////////////////////////
  let mouseover;
  interactionEvents({
    element: element,
  })
    .on("interaction", function (ev) {
      mouseover = track_interaction_zoom_data(store, ev);
      run_hide_tooltip(store, tooltip_fun);
    })
    .on("interactionend", function () {
      if (
        state.animation.time - state.animation.last_click <
        state.animation.dblclick_duration
      ) {
        doubleClicking(regl, store, catArgsManager, camerasManager, mouseover);
      } else {
        singleClicking(
          regl,
          store,
          catArgsManager,
          camerasManager,
          tooltip_fun,
          mouseover
        );
      }
    });
}
