import draw_interacting from "../draws/drawInteracting";
import double_clicking from "../interactions/doubleClicking";
import interactionEvents from "../interactions/interactionEvents";
import single_clicking from "../interactions/singleClicking";
import track_interaction_zoom_data from "../interactions/trackInteractionZoomData";
import { mutateCategoriesState } from "../state/reducers/categoriesSlice";
import run_hide_tooltip from "../tooltip/runHideTooltip";

export default function zoom_rules_high_mat(
  regl,
  state,
  dispatch,
  catArgsManager,
  cameras,
  tooltip_fun
) {
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
      mouseover = track_interaction_zoom_data(state, dispatch, ev);
      run_hide_tooltip(state.tooltip, tooltip_fun);
      dispatch(mutateCategoriesState({ showing_color_picker: false }));
      draw_interacting(regl, state, dispatch, catArgsManager, cameras);
    })
    .on("interactionend", function () {
      if (
        state.animation.time - state.animation.last_click <
        state.animation.dblclick_duration
      ) {
        double_clicking(regl, state, dispatch, catArgsManager, mouseover);
      } else {
        single_clicking(
          regl,
          state,
          dispatch,
          catArgsManager,
          tooltip_fun,
          mouseover
        );
      }
    });
}
